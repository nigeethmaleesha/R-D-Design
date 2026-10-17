<?php
declare(strict_types=1);
require __DIR__ . '/_common.php';

$first = rd_text('first_name', 80);
$last = rd_text('last_name', 80);
$email = rd_address('email');
$phone = rd_text('phone', 40);
$message = rd_text('message', 5000);
if ($first === '' || $last === '' || strlen($message) < 12) {
    rd_respond(422, 'Please complete your name and project details.');
}
rd_limit();
$content = "New RD Design project enquiry\n\nName: $first $last\nEmail: $email\nPhone: $phone\n\nMessage:\n$message\n";
rd_mail('RD Design | Project enquiry', $content, $email);
