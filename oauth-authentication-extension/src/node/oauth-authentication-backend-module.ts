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
import { ContainerModule } from "inversify";
import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core/lib/common';
import { OAuthAuthenticationService, oauthServicePath } from '../common/oauth-authentication-service';
import { OAuthAuthenticationServiceImpl } from './oauth-authentication-service-impl';

export default new ContainerModule(bind => {

    bind(EnvVars).toSelf();
    bind(OAuthAuthenticationService).to(OAuthAuthenticationServiceImpl).inSingletonScope();
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new JsonRpcConnectionHandler(oauthServicePath, () =>
            ctx.container.get(OAuthAuthenticationService)
        )
    ).inSingletonScope();
});
