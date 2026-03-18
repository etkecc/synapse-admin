import { etkeClient } from "./httpClients";
import {
  PaymentsResponse,
  RecurringCommand,
  ScheduledCommand,
  ServerNotificationsResponse,
  ServerProcessResponse,
  ServerStatusResponse,
  SupportMessage,
  SupportRequest,
  SupportRequestDetail,
} from "./types";

export const etkeProviderMethods = {
  getServerRunningProcess: async (
    etkeAdminUrl: string,
    locale: string,
    burstCache = false
  ): Promise<ServerProcessResponse> => {
    const locked_at = "";
    const command = "";

    let serverURL = `${etkeAdminUrl}/lock`;
    if (burstCache) {
      serverURL += `?time=${new Date().getTime()}`;
    }

    try {
      const response = await etkeClient(serverURL, locale);

      if (response.status === 503) {
        return { locked_at, command, maintenance: true };
      }

      if (!response.ok) {
        console.error(`Error getting server running process: ${response.status} ${response.statusText}`);
        return { locked_at, command, maintenance: false };
      }
      const status = response.status;

      if (status === 200) {
        const json = await response.json();
        return json as { locked_at: string; command: string };
      }
      if (status === 204) {
        return { locked_at, command, maintenance: false };
      }
    } catch (error) {
      console.error("Error getting server running process", error);
    }

    return { locked_at, command, maintenance: false };
  },

  getServerStatus: async (etkeAdminUrl: string, locale: string, burstCache = false): Promise<ServerStatusResponse> => {
    let serverURL = `${etkeAdminUrl}/status`;
    if (burstCache) {
      serverURL += `?time=${new Date().getTime()}`;
    }

    try {
      const response = await etkeClient(serverURL, locale);

      if (response.status === 503) {
        return { success: false, ok: false, host: "", results: [], maintenance: true };
      }

      if (!response.ok) {
        console.error(`Error getting server status: ${response.status} ${response.statusText}`);
        return { success: false, ok: false, host: "", results: [] };
      }

      const status = response.status;
      if (status === 200) {
        const json = await response.json();
        return { success: true, ...json } as ServerStatusResponse;
      }
    } catch (error) {
      console.error("Error getting server status", error);
    }

    return { success: false, ok: false, host: "", results: [] };
  },

  getServerNotifications: async (
    etkeAdminUrl: string,
    locale: string,
    burstCache = false
  ): Promise<ServerNotificationsResponse> => {
    let serverURL = `${etkeAdminUrl}/notifications`;
    if (burstCache) {
      serverURL += `?time=${new Date().getTime()}`;
    }

    try {
      const response = await etkeClient(serverURL, locale);
      if (response.status === 503) {
        return { success: false, notifications: [] };
      }
      if (!response.ok) {
        console.error(`Error getting server notifications: ${response.status} ${response.statusText}`);
        return { success: false, notifications: [] };
      }

      const status = response.status;
      if (status === 204) {
        return { success: true, notifications: [] };
      }

      if (status === 200) {
        const json = await response.json();
        return { success: true, notifications: json } as ServerNotificationsResponse;
      }

      return { success: true, notifications: [] };
    } catch (error) {
      console.error("Error getting server notifications", error);
    }

    return { success: false, notifications: [] };
  },

  deleteServerNotifications: async (etkeAdminUrl: string, locale: string) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/notifications`, locale, {
        method: "DELETE",
      });
      if (!response.ok) {
        console.error(`Error deleting server notifications: ${response.status} ${response.statusText}`);
        return { success: false };
      }

      const status = response.status;
      if (status === 204) {
        return { success: true };
      }
    } catch (error) {
      console.error("Error deleting server notifications", error);
    }

    return { success: false };
  },

  getUnits: async (etkeAdminUrl: string, locale: string): Promise<string[]> => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/units`, locale);

      if (!response.ok) {
        console.error(`Error fetching units: ${response.status} ${response.statusText}`);
        return [];
      }

      if (response.status === 204) {
        return [];
      }

      if (response.status === 200) {
        const json = await response.json();
        return json as string[];
      }
    } catch (error) {
      console.error("Error fetching units:", error);
    }

    return [];
  },

  getServerCommands: async (etkeAdminUrl: string, locale: string) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/commands`, locale);

      if (response.status === 503) {
        return { maintenance: true, commands: [] };
      }

      if (!response.ok) {
        console.error(`Error fetching server commands: ${response.status} ${response.statusText}`);
        return { maintenance: false, commands: [] };
      }

      const status = response.status;

      if (status === 200) {
        const json = await response.json();
        return { maintenance: false, commands: json };
      }

      return { maintenance: false, commands: [] };
    } catch (error) {
      console.error("Error fetching server commands:", error);
    }

    return { maintenance: false, commands: [] };
  },

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  runServerCommand: async (serverCommandsUrl: string, command: string, additionalArgs: Record<string, any> = {}) => {
    const endpoint_url = `${serverCommandsUrl}/commands`;
    const body = {
      command: command,
      ...additionalArgs,
    };
    const response = await fetch(endpoint_url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (response.status === 503) {
      return { success: false, maintenance: true };
    }

    if (!response.ok) {
      console.error(`Error running server command: ${response.status} ${response.statusText}`);
      return { success: false, maintenance: false };
    }

    if (response.status === 204) {
      return { success: true, maintenance: false };
    }

    return { success: false, maintenance: false };
  },

  getScheduledCommands: async (etkeAdminUrl: string, locale: string) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/schedules`, locale);
      if (response.status === 503) {
        return [];
      }

      if (!response.ok) {
        console.error(`Error fetching scheduled commands: ${response.status} ${response.statusText}`);
        return [];
      }

      const status = response.status;

      if (status === 200) {
        const json = await response.json();
        return json as ScheduledCommand[];
      }

      return [];
    } catch (error) {
      console.error("Error fetching scheduled commands:", error);
    }
    return [];
  },

  getRecurringCommands: async (etkeAdminUrl: string, locale: string) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/recurrings`, locale);

      if (response.status === 503) {
        return [];
      }

      if (!response.ok) {
        console.error(`Error fetching recurring commands: ${response.status} ${response.statusText}`);
        return [];
      }

      const status = response.status;

      if (status === 200) {
        const json = await response.json();
        return json as RecurringCommand[];
      }

      return [];
    } catch (error) {
      console.error("Error fetching recurring commands:", error);
    }
    return [];
  },

  createScheduledCommand: async (etkeAdminUrl: string, locale: string, command: Partial<ScheduledCommand>) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/schedules`, locale, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        console.error(`Error creating scheduled command: ${response.status} ${response.statusText}`);
        throw new Error("Failed to create scheduled command");
      }

      if (response.status === 204) {
        return command as ScheduledCommand;
      }

      const json = await response.json();
      return json as ScheduledCommand;
    } catch (error) {
      console.error("Error creating scheduled command", error);
      throw error;
    }
  },

  updateScheduledCommand: async (etkeAdminUrl: string, locale: string, command: ScheduledCommand) => {
    try {
      // Use the base endpoint without ID and use PUT for upsert
      const response = await etkeClient(`${etkeAdminUrl}/schedules`, locale, {
        method: "PUT", // Using PUT on the base endpoint
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        const jsonErr = JSON.parse(await response.text());
        console.error(`Error updating scheduled command: ${response.status} ${response.statusText}`);
        throw new Error(jsonErr.error);
      }

      // According to docs, successful response is 204 No Content
      if (response.status === 204) {
        // Return the command object we sent since the server doesn't return data
        return command;
      }

      // If server does return data (though docs suggest it returns 204)
      const json = await response.json();
      console.log("JSON", json);
      return json as ScheduledCommand;
    } catch (error) {
      console.error("Error updating scheduled command", error);
      throw error;
    }
  },

  deleteScheduledCommand: async (etkeAdminUrl: string, locale: string, id: string) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/schedules/${id}`, locale, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error(`Error deleting scheduled command: ${response.status} ${response.statusText}`);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting scheduled command", error);
      return { success: false };
    }
  },

  createRecurringCommand: async (etkeAdminUrl: string, locale: string, command: Partial<RecurringCommand>) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/recurrings`, locale, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        console.error(`Error creating recurring command: ${response.status} ${response.statusText}`);
        throw new Error("Failed to create recurring command");
      }

      if (response.status === 204) {
        // Return the command object we sent since the server doesn't return data
        return command as RecurringCommand;
      }

      const json = await response.json();
      return json as RecurringCommand;
    } catch (error) {
      console.error("Error creating recurring command", error);
      throw error;
    }
  },

  updateRecurringCommand: async (etkeAdminUrl: string, locale: string, command: RecurringCommand) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/recurrings`, locale, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        console.error(`Error updating recurring command: ${response.status} ${response.statusText}`);
        throw new Error("Failed to update recurring command");
      }

      if (response.status === 204) {
        // Return the command object we sent since the server doesn't return data
        return command as RecurringCommand;
      }

      const json = await response.json();
      return json as RecurringCommand;
    } catch (error) {
      console.error("Error updating recurring command", error);
      throw error;
    }
  },

  deleteRecurringCommand: async (etkeAdminUrl: string, locale: string, id: string) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/recurrings/${id}`, locale, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error(`Error deleting recurring command: ${response.status} ${response.statusText}`);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting recurring command", error);
      return { success: false };
    }
  },

  getPayments: async (etkeAdminUrl: string, locale: string) => {
    const response = await etkeClient(`${etkeAdminUrl}/payments`, locale);

    if (response.status === 503) {
      return { payments: [], total: 0, maintenance: true };
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch payments: ${response.status} ${response.statusText}`);
    }

    const status = response.status;

    if (status === 200) {
      const json = await response.json();
      return json as PaymentsResponse;
    }

    if (status === 204) {
      return { payments: [], total: 0, maintenance: false };
    }

    throw new Error(`${response.status} ${response.statusText}`); // Handle unexpected status codes
  },

  getInvoice: async (etkeAdminUrl: string, locale: string, transactionId: string) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/payments/${transactionId}/invoice`, locale);

      if (!response.ok) {
        let errorMessage = `Error fetching invoice: ${response.status} ${response.statusText}`;

        // Handle specific error codes
        switch (response.status) {
          case 404:
            errorMessage = "Invoice not found for this transaction";
            break;
          case 500:
            errorMessage = "Server error while generating invoice. Please try again later";
            break;
          case 401:
            errorMessage = "Unauthorized access. Please check your permissions";
            break;
          case 403:
            errorMessage = "Access forbidden. You don't have permission to download this invoice";
            break;
          default:
            errorMessage = `Failed to fetch invoice (${response.status}): ${response.statusText}`;
        }

        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Get the file as a blob
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Try to get filename from response headers
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `invoice_${transactionId}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      throw error; // Re-throw to let the UI handle the error
    }
  },

  getSupportRequests: async (etkeAdminUrl: string, locale: string) => {
    const response = await etkeClient(`${etkeAdminUrl}/support`, locale);
    if (response.status === 204) {
      return [];
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch support requests: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return (json.requests ?? json) as SupportRequest[];
  },

  getSupportRequest: async (etkeAdminUrl: string, locale: string, id: string) => {
    const response = await etkeClient(`${etkeAdminUrl}/support/${id}`, locale);
    if (!response.ok) {
      throw new Error(`Failed to fetch support request: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return json as SupportRequestDetail;
  },

  createSupportRequest: async (etkeAdminUrl: string, locale: string, subject: string, message: string) => {
    const response = await etkeClient(`${etkeAdminUrl}/support`, locale, {
      method: "POST",
      body: JSON.stringify({ subject, message }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create support request: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return json as SupportRequest;
  },

  postSupportMessage: async (etkeAdminUrl: string, locale: string, id: string, message: string) => {
    const response = await etkeClient(`${etkeAdminUrl}/support/${id}`, locale, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      throw new Error(`Failed to post support message: ${response.status} ${response.statusText}`);
    }
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return {} as SupportMessage;
    }
    const json = await response.json();
    return json as SupportMessage;
  },
};
