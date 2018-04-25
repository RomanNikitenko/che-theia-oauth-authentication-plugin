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

export const oauthServicePath = '/services/authentication/oauth';
export const OAuthAuthenticationService = Symbol('OAuthAuthenticationService');

/**
 * The JSON-RPC OAuth authentication service interface.
 */
export interface OAuthAuthenticationService {

    /**
     * Gets authentication url for given OAuth provider
     *
     * @param oauthProvider OAuth provider name
     * @param scopes        specifies exactly what type of access needed. List of scopes dependents to OAuth provider.
     *                      Requested scopes are displayed at user authorization page at OAuth provider site. 
     *                      Check docs about scopes supported by suitable OAuth provider.
     */
    getAuthenticationUrl(oauthProvider: string, scopes?: string[]): Promise<string>;

    /**
     * Gets OAuth token for given OAuth provider
     *
     * @param oauthProvider OAuth provider name
     */
    getToken(oauthProvider: string): Promise<OAuthToken>;

    /**
     * Invalidates OAuth token for given OAuth provider
     *
     * @param oauthProvider OAuth provider name
     */
    invalidateToken(oauthProvider: string): Promise<void>;

    /**
     * Gets list of installed OAuth authenticators
     *
     * @return list of installed OAuth authenticators
     */
    getRegisteredAuthenticators(): Promise<Set<OAuthAuthenticatorDescriptor>>;
}

export interface OAuthToken {
    /** OAuth token */
    token: string;

    /** OAuth scope */
    scope: string;
}

/** Describes OAuth authenticator */
export interface OAuthAuthenticatorDescriptor {
    name: string;
    links: Link[];
}

/** Describes resource */
export interface Link {

    /** URL of resource link */
    href: string;

    /** Short description of resource link */
    rel: string;

    /** HTTP method to use with resource */
    method: string;

    /** Media type produced by resource */
    produces: string;

    /** Media type consumed by resource */
    consumes: string;

    /** Description of the query parameters (if any) of request */
    parameters: LinkParameter[];
}

export interface LinkParameter {
    /** Name of parameter */
    name: string;

    /** Default Value of parameter */
    defaultValue: string;

    /** Optional description of parameter */
    description: string;

    /** Reports whether the parameter is mandatory */
    isRequired: boolean;
}
