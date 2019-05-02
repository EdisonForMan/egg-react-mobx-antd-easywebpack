import React, { Component } from 'react';

export default class Layout extends Component {
  render() {
    return (
      <html>
        <head>
          <title>{this.props.title || '反欺诈-管理后台'}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"
          />
          {/* https == true 时 加入https头部 */}
          {this.props.apiConfig.https ? (
            <meta
              httpEquiv="Content-Security-Policy"
              content="upgrade-insecure-requests"
            />
          ) : (
              undefined
            )}
          <meta name="keywords" content={this.props.keywords} />
          <meta name="description" content={this.props.description} />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          {/* eslint-disable react/no-danger */}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__API_CONFIG__ = ${JSON.stringify(
                this.props.apiConfig
              )}`
            }}
          />
          {/* eslint-enable react/no-danger */}
        </head>
        <body>
          <div id="app">{this.props.children}</div>
        </body>
      </html>
    );
  }
}