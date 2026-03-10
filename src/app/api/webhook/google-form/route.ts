import { sendWorkflowExecution } from "@/inngest/utils";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");
    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query paramete: workflowId",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      respondentEmail: body.respondentEmail,
      responses: body.responses,
      raw: body,
    };

    await sendWorkflowExecution({
      workflowId,
      initialData: { googleForm: formData },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log("Google form webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process Google Form submission",
      },
      { status: 500 },
    );
  }
};
