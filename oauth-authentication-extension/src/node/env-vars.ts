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

import { injectable } from 'inversify';

/**
 * Enumeration of currently supported environment variable names
 */
enum VarNames {
    /* Che API endpoint location */
    CHE_INTERNAL_API = 'CHE_INTERNAL_API',

    /* Che user identifier */
    CHE_USER_ID = 'CHE_USER_ID',

    /* Theia base URL (e.g. 'http://localhost:3000') */
    THEIA_BASE_URL = 'THEIA_BASE_URL'
}

@injectable()
export class EnvVars {

    private readonly vars: Map<string, string> = new Map();

    constructor() {
        Object.keys(VarNames).forEach(value => {
            if (process.env.hasOwnProperty(value)) {
                this.vars.set(value, process.env[value] as string);
            }
        });
    }

    /**
     * Che API endpoint location
     *
     * @returns {string | undefined}
     */
    get cheApi() {
        return this.vars.get(VarNames.CHE_INTERNAL_API);
    }

    /**
     * Che user identifier
     *
     * @returns {string | undefined}
     */
    get cheUserId() {
        return this.vars.get(VarNames.CHE_USER_ID);
    }

    /**
     * Theia base URL
     *
     * @returns {string | undefined}
     */
    get theiaBaseUrl() {
        return this.vars.get(VarNames.THEIA_BASE_URL);
    }
}
