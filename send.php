<?php
header('Content-Type: application/json');

// Используем PHPMailer для надежной отправки через Gmail SMTP
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Пустые данные']);
    exit;
}

function sanitize($str) {
    return htmlspecialchars(stripslashes(trim($str)), ENT_QUOTES, 'UTF-8');
}

$phone = sanitize($data['phone'] ?? '');
$otherContact = sanitize($data['otherContact'] ?? '');
$company = sanitize($data['company'] ?? '');
$direction = sanitize($data['direction'] ?? '');
$comment = sanitize($data['comment'] ?? '');
$timestamp = sanitize($data['ts'] ?? '');
$contactType = sanitize($data['contactType'] ?? '');

// Определяем контакт
$contact = ($contactType === 'phone') ? $phone : $otherContact;

try {
    $mail = new PHPMailer(true);
    
    // SMTP Settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'huliobernandini@gmail.com';
    $mail->Password = 'xtdy leep puiy qzyi'; // Пароль приложения
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true,
        ]
    ];

    // Recipients
    $mail->setFrom('huliobernandini@gmail.com', 'Заявка со сайта');
    $mail->addAddress('huliobernandini@gmail.com');

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Новая заявка на расчёт стоимости';
    
    $html = "
    <h2>Новая заявка получена!</h2>
    <p><strong>Время:</strong> {$timestamp}</p>
    <hr>
    <p><strong>Контакт ({$contactType}):</strong> {$contact}</p>
    <p><strong>Организация:</strong> " . ($company ?: 'Не указана') . "</p>
    <p><strong>Направление услуг:</strong> {$direction}</p>
    <p><strong>Комментарий:</strong> " . ($comment ?: 'Не заполнено') . "</p>
    ";
    
    $mail->Body = $html;

    if ($mail->send()) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Заявка отправлена']);
    } else {
        throw new Exception('Ошибка при отправке письма');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка: ' . $e->getMessage()]);
}
?>
