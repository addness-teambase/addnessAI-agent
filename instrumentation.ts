export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeSDK, ATTR_SERVICE_NAME, resourceFromAttributes } = await import(
      '@mastra/core/telemetry/otel-vendor'
    );

    // resourceFromAttributesを使用してリソースを作成
    const resource = resourceFromAttributes({
      [ATTR_SERVICE_NAME]: "ai-agent-presentation",
    });

    const sdk = new NodeSDK({
      resource: resource,
      // 他の設定は必要に応じて追加
    });

    sdk.start();
  }
} 