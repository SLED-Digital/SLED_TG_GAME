declare namespace Telegram {
    interface WebAppUser {
        id: number;
        is_bot?: boolean;
        first_name: string;
        last_name?: string;
        username?: string;
        language_code?: string;
        photo_url?: string;
    }

    interface WebAppInitData {
        query_id?: string;
        user?: WebAppUser;
        receiver?: WebAppUser;
        chat_type?: string;
        chat_instance?: string;
        start_param?: string;
        can_send_after?: number;
        auth_date: number;
        hash: string;
    }

    interface WebApp {
        initData: string;
        initDataUnsafe: WebAppInitData;
        ready: () => void;
        expand: () => void;
        close: () => void;
        onEvent: (event: string, callback: () => void) => void;
        offEvent: (event: string, callback: () => void) => void;
        sendData: (data: never) => void;
        openLink: (url: string) => void;
        openTelegramLink: (url: string) => void;
        openInvoice: (url: string, callback?: () => void) => void;
        showPopup: (params: never, callback?: (button_id: string) => void) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (ok: boolean) => void) => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
        disableClosingConfirmation: () => void;
        isClosingConfirmationEnabled: () => boolean;
        themeParams: {
            bg_color?: string;
            text_color?: string;
            hint_color?: string;
            link_color?: string;
            button_color?: string;
            button_text_color?: string;
        };
        viewportHeight: number;
        viewportStableHeight: number;
        isExpanded: boolean;
        isClosingConfirmationEnabled: boolean;
    }

    const WebApp: WebApp;
}