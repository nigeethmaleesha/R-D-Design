<?php
declare(strict_types=1);
require __DIR__ . '/_common.php';
$email = rd_address('email');
rd_limit();
// This sends a join request to the studio; a mailing-list service is NOT automatically connected.
rd_mail('RD Design | Newsletter join request', "Please review this newsletter join request.\nEmail: $email\n", $email);
