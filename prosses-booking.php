<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $eventType = $_POST['event-type'];
    $date = $_POST['date'];
    $startTime = $_POST['start-time'];
    $endTime = $_POST['end-time'];
    $message = $_POST['message'];
    
    // Your email address where you want to receive bookings
    $to = "your-email@emaartstudio.com";
    $subject = "New Booking Request: $eventType";
    
    // Email content
    $email_content = "You have a new booking request:\n\n";
    $email_content .= "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n";
    $email_content .= "Event Type: $eventType\n";
    $email_content .= "Date: $date\n";
    $email_content .= "Time: $startTime - $endTime\n";
    $email_content .= "Message: $message\n";
    
    // Email headers
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    
    // Send email
    if (mail($to, $subject, $email_content, $headers)) {
        // Success - redirect to thank you page
        header('Location: thank-you.html');
        exit;
    } else {
        // Error - redirect to error page
        header('Location: error.html');
        exit;
    }
}
?>