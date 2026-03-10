import type { NodeExecutor } from "@/inngest/lib/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";
import { httpRequestChannel } from "@/inngest/channels/http-request";

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
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
  publish,
}) => {
  await publish(httpRequestChannel().status({ nodeId, status: "loading" }));

  try {
    const result = await step.run("http-request", async () => {
      if (!data.variableName) {
        await publish(httpRequestChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError(
          "HTTP Request node is not configured with a variable name",
        );
      }

      if (!data.method) {
        await publish(httpRequestChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError(
          "HTTP Request node is not configured with method ",
        );
      }

      if (!data.endpoint) {
        await publish(httpRequestChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError(
          "HTTP Request node is not configured with an endpoint",
        );
      }

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

    await publish(httpRequestChannel().status({ nodeId, status: "success" }));

    return result;
  } catch (error) {
    await publish(httpRequestChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
