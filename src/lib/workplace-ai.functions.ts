import { createServerFn } from "@tanstack/react-start";
import { Output, streamText } from "ai";
import { z } from "zod";
import { createWorkplaceModel } from "./ai-gateway.server";

const requestSchema = z.discriminatedUnion("tool", [
  z.object({
    tool: z.literal("email"),
    purpose: z.string().min(2).max(4000),
    recipient: z.string().min(2).max(2000),
    keyPoints: z.string().min(2).max(6000),
    instructions: z.string().max(3000),
    tone: z.enum(["Formal", "Friendly", "Persuasive"]),
  }),
  z.object({
    tool: z.literal("meeting"),
    notes: z.string().min(20).max(30000),
  }),
  z.object({
    tool: z.literal("planner"),
    tasks: z.string().min(5).max(12000),
    priorities: z.string().min(2).max(4000),
    hours: z.string().min(2).max(1000),
    deadlines: z.string().max(4000),
    period: z.enum(["Daily", "Weekly"]),
  }),
]);

const emailOutput = z.object({
  subject: z.string(),
  body: z.string(),
});

const meetingOutput = z.object({
  summary: z.string(),
  actionItems: z.array(z.string()),
  decisions: z.array(z.string()),
  deadlines: z.array(z.string()),
});

const plannerOutput = z.object({
  title: z.string(),
  schedule: z.array(
    z.object({
      time: z.string(),
      task: z.string(),
      detail: z.string(),
      priority: z.enum(["High", "Medium", "Low"]),
    }),
  ),
  recommendations: z.array(z.string()),
});

export const generateWorkplaceContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => requestSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured for this workspace.");

    try {
      const providerOptions = {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low" as const,
          reasoningSummary: "auto" as const,
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      };
      if (data.tool === "email") {
        const result = streamText({
          model: createWorkplaceModel(apiKey),
          output: Output.object({ schema: emailOutput }),
          prompt: `Write a unique, polished workplace email using only the supplied facts.\nTone: ${data.tone}\nPurpose: ${data.purpose}\nRecipient and context: ${data.recipient}\nKey points: ${data.keyPoints}\nAdditional instructions: ${data.instructions || "None"}\nReturn a concise subject and a complete send-ready body. Never invent names, dates, promises, or facts.`,
          providerOptions,
        });
        return await result.output;
      }
      if (data.tool === "meeting") {
        const result = streamText({
          model: createWorkplaceModel(apiKey),
          output: Output.object({ schema: meetingOutput }),
          prompt: `Analyze these meeting notes faithfully. Return a concise executive summary, explicit action items, confirmed decisions, and deadlines. If a category is absent, return an empty list. Never invent owners, dates, or decisions.\n\nMEETING NOTES:\n${data.notes}`,
          providerOptions,
        });
        return await result.output;
      }
      const result = streamText({
        model: createWorkplaceModel(apiKey),
        output: Output.object({ schema: plannerOutput }),
        prompt: `Create a realistic ${data.period.toLowerCase()} work schedule based only on this brief. Respect working hours, deadlines, and priorities; include breaks and focused work blocks where appropriate.\nTasks: ${data.tasks}\nPriorities: ${data.priorities}\nAvailable working hours: ${data.hours}\nDeadlines: ${data.deadlines || "None specified"}\nUse clear time/day labels, task names, short practical details, and priority levels.`,
        providerOptions,
      });
      return await result.output;
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI generation failed.";
      throw new Error(message);
    }
  });