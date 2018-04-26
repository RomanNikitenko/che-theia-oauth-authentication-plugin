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

import { ContainerModule } from "inversify";
import { WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { CommandContribution, MenuContribution } from "@theia/core/lib/common";
import { OAuthAuthenticationService, oauthServicePath } from '../common/oauth-authentication-service';
import { OAuthAuthenticationManagerImpl, OAuthAuthenticationManager } from './oauth-authentication-manager';
import { OauthAuthenticationCommandContribution, OauthAuthenticationMenuContribution } from './oauth-authentication-contribution';

export default new ContainerModule(bind => {

    bind(OAuthAuthenticationService).toDynamicValue(ctx => {
        const provider = ctx.container.get(WebSocketConnectionProvider);
        return provider.createProxy<OAuthAuthenticationService>(oauthServicePath);
    }).inSingletonScope();

    bind(CommandContribution).to(OauthAuthenticationCommandContribution);
    bind(MenuContribution).to(OauthAuthenticationMenuContribution);
    bind(OAuthAuthenticationManager).to(OAuthAuthenticationManagerImpl).inSingletonScope;
});