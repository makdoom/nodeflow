import type { NodeExecutor } from "@/inngest/lib/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  context,
  nodeId,
  step,
}) => {
  if (!data.endpoint) {
    // TODO: publish error state
    throw new NonRetriableError(
      "HTTP Request node is not configured with an endpoint",
    );
  }

  // TODO: publish loading state
  const result = await step.run("http-request", async () => {
    const endpoint = data.endpoint!;
    const method = data.method || "GET";

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      if (data.body) options.body = data.body;
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        responseText: response.statusText,
        data: responseData,
      },
    };
  });

  // TODO: publish success state with result

  return result;
};
