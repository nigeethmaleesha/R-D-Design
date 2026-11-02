<?php
declare(strict_types=1);
require __DIR__ . '/_common.php';

$name = rd_text('full_name', 160);
$email = rd_address('email');
$phone = rd_text('phone', 40);
$company = rd_text('company_name', 160);
$category = rd_text('category', 30);
$message = rd_text('message', 5000);
$categories = [
    'general' => ['General Enquiries', 'RD_GENERAL_TO'],
    'careers' => ['Careers', 'RD_CAREERS_TO'],
    'vendors' => ['Vendors', 'RD_VENDORS_TO'],
];
if ($name === '' || strlen($message) < 5 || !isset($categories[$category])) {
    rd_respond(422, 'Please provide your name, enquiry category and message.');
}
rd_limit();
[$label, $emailVariable] = $categories[$category];
$categoryRecipient = trim((string) getenv($emailVariable));
// Individual inboxes can be configured later; until then RD_CONTACT_TO remains the fallback.
$recipient = filter_var($categoryRecipient, FILTER_VALIDATE_EMAIL) ? $categoryRecipient : null;
$phone = $phone ?: 'Not provided';
$company = $company ?: 'Not provided';
$content = "New RD Design enquiry\n\nCategory: $label\nFull Name: $name\nEmail: $email\nMobile: $phone\nCompany: $company\n\nMessage:\n$message\n";
rd_mail('RD Design | ' . $label, $content, $email, $recipient);
