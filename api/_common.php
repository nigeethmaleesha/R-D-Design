<?php
/** RD Design form transport for PHP hosting. SMTP/mail transport must be configured on the host. */
declare(strict_types=1);

$allowedOrigin = trim((string) getenv('RD_ALLOWED_ORIGIN'));
if ($allowedOrigin !== '' && isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $allowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Vary: Origin');
}
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if ($allowedOrigin !== '' && ($_SERVER['HTTP_ORIGIN'] ?? '') === $allowedOrigin) {
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Accept, Content-Type');
        exit;
    }
    http_response_code(403);
    echo json_encode(['ok' => false, 'message' => 'Origin not allowed.']);
    exit;
}

function rd_respond(int $status, string $message): void {
    http_response_code($status);
    echo json_encode(['ok' => $status >= 200 && $status < 300, 'message' => $message], JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    rd_respond(405, 'Only POST requests are supported.');
}
if (isset($_SERVER['CONTENT_LENGTH']) && (int) $_SERVER['CONTENT_LENGTH'] > 18000) {
    rd_respond(413, 'Request is too large.');
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    $host = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
    if (!is_string($originHost) || !hash_equals(strtolower($host), strtolower($originHost))) {
        if ($allowedOrigin === '' || !hash_equals($allowedOrigin, $origin)) rd_respond(403, 'Origin not allowed.');
    }
}
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    // Honeypot receives a benign response without sending anything.
    rd_respond(200, 'Thank you for your message.');
}

function rd_text(string $key, int $length): string {
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) rd_respond(422, 'Invalid form field.');
    $value = trim(strip_tags($value));
    if (strlen($value) > $length * 4) rd_respond(422, 'A form field is too long.');
    return preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value) ?? '';
}
function rd_address(string $key): string {
    $email = rd_text($key, 254);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email)) {
        rd_respond(422, 'Please enter a valid email address.');
    }
    return $email;
}
function rd_limit(): void {
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $key = hash('sha256', $ip . ':rd-design-form-v1');
    $file = sys_get_temp_dir() . '/rd-design-rate-' . substr($key, 0, 24) . '.json';
    $handle = @fopen($file, 'c+');
    if ($handle === false) return; // Shared hosting may not permit temporary files.
    if (!flock($handle, LOCK_EX)) { fclose($handle); return; }
    $raw = stream_get_contents($handle);
    $data = json_decode($raw ?: '', true);
    $now = time();
    $events = array_values(array_filter(is_array($data) ? $data : [], fn($t) => is_int($t) && $t > $now - 3600));
    if (count($events) >= 8) {
        flock($handle, LOCK_UN); fclose($handle);
        rd_respond(429, 'Too many requests. Please try again later.');
    }
    $events[] = $now;
    rewind($handle); ftruncate($handle, 0);
    fwrite($handle, json_encode($events));
    fflush($handle); flock($handle, LOCK_UN); fclose($handle);
}
function rd_mail(string $subject, string $message, ?string $replyTo = null): void {
    $to = trim((string) getenv('RD_CONTACT_TO'));
    $from = trim((string) getenv('RD_MAIL_FROM'));
    if (!filter_var($to, FILTER_VALIDATE_EMAIL) || !filter_var($from, FILTER_VALIDATE_EMAIL)) {
        error_log('RD Design: RD_CONTACT_TO and RD_MAIL_FROM must be configured.');
        rd_respond(503, 'Email delivery is not configured yet. Please contact the studio directly.');
    }
    $headers = ['From: RD Design Website <' . $from . '>', 'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8'];
    if ($replyTo !== null) $headers[] = 'Reply-To: ' . $replyTo;
    if (!mail($to, $subject, $message, implode("\r\n", $headers))) {
        error_log('RD Design: PHP mail() failed.');
        rd_respond(503, 'Email could not be delivered. Please contact the studio directly.');
    }
    rd_respond(200, 'Thank you. Your request has been delivered to the studio.');
}
