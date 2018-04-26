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
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MAIN_MENU_BAR } from "@theia/core/lib/common";
import { OAuthAuthenticationManager } from "./oauth-authentication-manager";

export namespace OauthCommands {
    export const GetRegisteredAuthenticators = {
        id: 'GetRegisteredAuthenticators.command',
        label: "Get Registered Authenticators"
    };

    export const Authenticate = {
        id: 'Authenticate.command',
        label: "Authenticate"
    };

    export const GetToken = {
        id: 'GetOauthToken.command',
        label: "Get Oauth Token"
    };

    export const InvalidateToken = {
        id: 'InvalidateOauthToken.command',
        label: "Invalidate Oauth Token"
    };
}

export namespace OauthActions {
    export const OAUTH = [...MAIN_MENU_BAR, '0_oauth'];
    export const GET_AUTHENTICATOS = [...OAUTH, '1_get_authenticators'];
    export const AUTHENTICATE = [...OAUTH, '2_authenticate'];
    export const GET_TOKEN = [...OAUTH, '3_get_token'];
    export const INVALIDATE_TOKEN = [...OAUTH, '4_invalidate_token'];
}

//TODO the class is designed for demo only - should be removed
@injectable()
export class OauthAuthenticationCommandContribution implements CommandContribution {

    constructor( @inject(OAuthAuthenticationManager) protected readonly oauthManager: OAuthAuthenticationManager) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(OauthCommands.GetToken, {
            execute: () => {
                console.log('get oauth token request');
                this.oauthManager.getToken('github').then(response => {
                    console.log(`get token ${response.token}`);
                }).catch(error => {
                    console.log(`get token ERROR ${error}`);
                });
            }
        });

        registry.registerCommand(OauthCommands.InvalidateToken, {
            execute: () => {
                console.log("invalidate oauth token request ");
                this.oauthManager.invalidateToken('github').then(response => {
                    console.log("success invalidate token ");
                }).catch(error => {
                    console.log(`error invalidate token ${error}`);
                });

            }
        });

        registry.registerCommand(OauthCommands.Authenticate, {
            execute: () => {
                let scopes = ["user", "repo", "write:public_key"];
                this.oauthManager.authenticate('github', scopes).then(() => {
                    console.log('from action = authenticate');
                });;
            }
        });

        registry.registerCommand(OauthCommands.GetRegisteredAuthenticators, {
            execute: () => {
                this.oauthManager.getRegisteredAuthenticators().then(authenticators => {
                    for (let entry of authenticators) {
                        console.log(`from action = registered authenticators ${entry}`);
                    }
                });;
            }
        });
    }
}

@injectable()
export class OauthAuthenticationMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerSubmenu(OauthActions.OAUTH, 'OAuth');

        menus.registerMenuAction(OauthActions.GET_AUTHENTICATOS, {
            commandId: OauthCommands.GetRegisteredAuthenticators.id,
            label: 'Get Registered Authenticators'
        });

        menus.registerMenuAction(OauthActions.AUTHENTICATE, {
            commandId: OauthCommands.Authenticate.id,
            label: 'Authenticate'
        });

        menus.registerMenuAction(OauthActions.GET_TOKEN, {
            commandId: OauthCommands.GetToken.id,
            label: 'Get OAuth token'
        });

        menus.registerMenuAction(OauthActions.INVALIDATE_TOKEN, {
            commandId: OauthCommands.InvalidateToken.id,
            label: 'Invalidate OAuth token'
        });
    }
}