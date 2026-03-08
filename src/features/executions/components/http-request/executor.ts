import type { NodeExecutor } from "@/inngest/lib/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  context,
  nodeId,
  step,
}) => {
  if (!data.variableName) {
    // TODO: publish error state
    throw new NonRetriableError(
      "HTTP Request node is not configured with a variable name",
    );
  }

  if (!data.method) {
    // TODO: publish error state
    throw new NonRetriableError(
      "HTTP Request node is not configured with method ",
    );
  }

  if (!data.endpoint) {
    // TODO: publish error state
    throw new NonRetriableError(
      "HTTP Request node is not configured with an endpoint",
    );
  }

  // TODO: publish loading state
  const result = await step.run("http-request", async () => {
    const endpoint = Handlebars.compile(data.endpoint)(context);
    const method = data.method || "GET";

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      if (data.body) {
        const resolved = Handlebars.compile(data.body)(context);
        // Just to protect invalid json
        JSON.parse(resolved);

        options.body = resolved;
        options.headers = { "Content-Type": "application/json" };
      }
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        responseText: response.statusText,
        data: responseData,
      },
    };

    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });

  // TODO: publish success state with result

  return result;
};
