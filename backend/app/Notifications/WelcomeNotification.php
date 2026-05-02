<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected string $name
    ) {
        $this->onQueue('notifications');
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage())
            ->subject("مرحبا {$this->name}، أهلا بك في عالم نفَس")
            ->greeting("مرحبا {$this->name}، أهلا بك في عالم نفَس")
            ->line('يسعدنا انضمامك إلى نفَس. رحلتك القادمة مع الرائحة بدأت الآن.')
            ->action('اكتشف المجموعة', config('app.frontend_url', 'http://localhost:5173/shop'))
            ->line('إذا احتجت أي مساعدة، يمكن لفريق نفَس التواصل معك عبر قناة الدعم المتاحة.');

        $whatsappUrl = config('services.whatsapp.url');
        if ($whatsappUrl) {
            $message->line("للدعم عبر واتساب: {$whatsappUrl}");
        }

        return $message;
    }
}
