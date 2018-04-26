/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

/**
 * Popup window to redirect user to OAuth provider site for authentication|authorization.
 * It is expected that authentication Url contains 'redirect_after_login' query parameter.
 * In this case popup window will be closed automatically when OAuth provider site redirects user after login to application homepage. 
 */
export class OAuthWindow {
    private popup: Window | null;
    private popupTrackingId: number | undefined;
    private closeHandler?: () => void;

    constructor(readonly authenticationUrl: string, readonly width?: number, readonly height?: number) {
        this.popup = null;
        this.popupTrackingId = undefined;
    }

    open(closeHandler?: () => void) {
        this.closeHandler = closeHandler;

        let width = this.width ? this.width : window.innerWidth - Math.round(window.innerWidth / 3);
        let height = this.height ? this.height : window.innerHeight - Math.round(window.innerHeight / 3);

        let left = Math.max(0, Math.round(window.innerWidth / 2) - Math.round(width / 2));
        let top = Math.max(0, Math.round(window.innerHeight / 2) - Math.round(height / 2));

        this.popup = window.open(this.authenticationUrl, 'popup', `width=${width},height=${height},left=${left},top=${top}`);

        this.popupTrackingId = window.setInterval(() => {
            if (this.popup == null || this.popup.closed) {
                this.onPopupClosed();
                return;
            }

            try {
                let popupHostName = this.popup.location.hostname;
                let windowHostName = window.location.hostname;
                if (windowHostName && popupHostName && windowHostName === popupHostName) {
                    this.popup.close();
                    this.onPopupClosed();
                }
            } catch (e) { }
        }, 300);
    }

    close(): void {
        if (this.popup !== null && !this.popup.closed) {
            this.popup.close();
        }
    }

    isOpen(): boolean {
        return this.popup !== null && !this.popup.closed;
    }

    private onPopupClosed() {
        if (this.popupTrackingId) {
            window.clearInterval(this.popupTrackingId);
        }

        if (this.closeHandler) {
            this.closeHandler();
        }
    }
}
