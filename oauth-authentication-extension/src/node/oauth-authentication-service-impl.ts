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
import { EnvVars } from './env-vars';
import { inject, injectable } from 'inversify';
import { AxiosInstance, default as axios } from 'axios';
import { OAuthAuthenticationService, OAuthToken, OAuthAuthenticatorDescriptor } from '../common/oauth-authentication-service';

@injectable()
export class OAuthAuthenticationServiceImpl implements OAuthAuthenticationService {
    private readonly DEFAULT_CHE_USER = 'che';

    private readonly axiosInstance: AxiosInstance;
    private readonly userId: string | undefined;
    private readonly cheApi: string | undefined;
    private readonly theiaBaseUrl: string | undefined;

    constructor( @inject(EnvVars) protected readonly envVars: EnvVars) {
        let cheApi = envVars.cheApi;
        checkNotUndefined(cheApi, 'CHE_API environment property is undefined');

        let theiaBaseUrl = envVars.theiaBaseUrl;
        checkNotUndefined(theiaBaseUrl, 'THEIA_BASE_URL environment property is undefined');

        this.cheApi = cheApi;
        this.theiaBaseUrl = theiaBaseUrl;
        this.axiosInstance = axios.create({ baseURL: this.cheApi });

        let userId = envVars.cheUserId;
        if (!userId) {
            this.userId = this.DEFAULT_CHE_USER;
        }
    }

    getAuthenticationUrl(oauthProvider: string, scopes?: string[]): Promise<string> {
        let scope = scopes ? scopes.join("%20") : "";
        let authenticateUrl = `${this.cheApi}/oauth/authenticate?oauth_provider=${oauthProvider}&scope=${scope}&userId=${this.userId}&redirect_after_login=${this.theiaBaseUrl}`;
        return Promise.resolve(authenticateUrl);
    }

    getToken(oauthProvider: string): Promise<OAuthToken> {
        return new Promise<OAuthToken>((resolve, reject) => {
            this.axiosInstance.get<OAuthToken>(`oauth/token?oauth_provider=${oauthProvider}`)
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response) {
                        reject(new Error(`${error.response.status}: ${error.response.data.message}`));
                    } else {
                        reject(error);
                    }
                }
                );
        });
    }

    invalidateToken(oauthProvider: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.axiosInstance.delete(`oauth/token?oauth_provider=${oauthProvider}`)
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response) {
                        reject(new Error(`${error.response.status}: ${error.response.data.message}`));
                    } else {
                        reject(error);
                    }
                }
                );
        });
    }

    getRegisteredAuthenticators(): Promise<Set<OAuthAuthenticatorDescriptor>> {
        return new Promise<Set<OAuthAuthenticatorDescriptor>>((resolve, reject) => {
            this.axiosInstance.get<Set<OAuthAuthenticatorDescriptor>>('oauth')
                .then(response => {
                    resolve(response.data);
                }).catch(error => {
                    if (error.response) {
                        reject(new Error(`${error.response.status}: ${error.response.data.message}`));
                    } else {
                        reject(error);
                    }
                }
                );
        });
    }
}

export function checkNotUndefined(object: any, errorMessage: string) {
    if (!object) {
        throw new Error(errorMessage);
    }
}
