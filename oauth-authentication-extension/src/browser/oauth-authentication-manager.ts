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

import { injectable, inject } from "inversify";
import { OAuthWindow } from './oauth-window';
import { OAuthAuthenticationService, OAuthToken, OAuthAuthenticatorDescriptor } from '../common/oauth-authentication-service';

export const OAuthAuthenticationManager = Symbol('OAuthAuthenticationManager');

/** Manager for OAuth authentication related operations. */
export interface OAuthAuthenticationManager {

    /**
     * Redirects user to OAuth provider site for authentication|authorization.
     *
     * @param oauthProvider OAuth provider name
     * @param scopes        specifies exactly what type of access needed. List of scopes dependents to OAuth provider.
     *                      Requested scopes are displayed at user authorization page at OAuth provider site. 
     *                      Check docs about scopes supported by suitable OAuth provider.
     */
    authenticate(oauthProvider: string, scopes?: string[]): Promise<void>;

    /**
     * Gets OAuth token.
     *
     * @param oauthProvider OAuth provider name
     */
    getToken(oauthProvider: string): Promise<OAuthToken>;

    /** 
     * Invalidates token for given OAuth provider. 
     * 
     * @param oauthProvider OAuth provider name
     */
    invalidateToken(oauthProvider: string): Promise<void>;

    /**
     * Gets set of installed OAuth authenticators.
     *
     * @return set of installed OAuth authenticators
     */
    getRegisteredAuthenticators(): Promise<Set<OAuthAuthenticatorDescriptor>>;
}

@injectable()
export class OAuthAuthenticationManagerImpl implements OAuthAuthenticationManager {

    constructor( @inject(OAuthAuthenticationService) protected readonly oauthService: OAuthAuthenticationService) { }

    authenticate(oauthProvider: string, scopes: string[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.oauthService.getAuthenticationUrl(oauthProvider, scopes).then(url => {
                let oauthWindow = new OAuthWindow(url);
                oauthWindow.open(() => {
                    resolve();
                });
            }).catch(error => {
                reject(error);
            });
        });
    }

    getToken(oauthProvider: string): Promise<OAuthToken> {
        return this.oauthService.getToken(oauthProvider);
    }

    invalidateToken(oauthProvider: string): Promise<void> {
        return this.oauthService.invalidateToken(oauthProvider);
    }

    getRegisteredAuthenticators(): Promise<Set<OAuthAuthenticatorDescriptor>> {
        return this.oauthService.getRegisteredAuthenticators();
    }
}
