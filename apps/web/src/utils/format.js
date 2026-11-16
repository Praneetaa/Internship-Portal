// Small display helpers shared by the student and organisation pages.

/** 8000 → "฿8,000" */
export const formatBaht = (amount) =>
   amount || amount === 0 ? `฿${Number(amount).toLocaleString("en-US")}` : "";

/** "May 7, 2026" */
export const formatDate = (value) =>
   value
      ? new Date(value).toLocaleDateString("en-US", {
           month: "short",
           day: "numeric",
           year: "numeric",
        })
      : "—";

/** "Thu, May 7 · 2:00 PM" */
export const formatDateTime = (value) =>
   value
      ? new Date(value).toLocaleString("en-US", {
           weekday: "short",
           month: "short",
           day: "numeric",
           hour: "numeric",
           minute: "2-digit",
        })
      : "—";

/** { month: "MAY", day: "07" } for calendar-style date stubs */
export const dateStub = (value) => {
   if (!value) return { month: "—", day: "" };
   const d = new Date(value);
   return {
      month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
      day: String(d.getDate()).padStart(2, "0"),
   };
};

/** Whole days from now until the date (negative if in the past). */
export const daysUntil = (value) => {
   if (!value) return null;
   const ms = new Date(value).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
   return Math.round(ms / 86400000);
};

/** "today", "tomorrow", "in 5 days", "3 days ago" */
export const relativeDays = (value) => {
   const n = daysUntil(value);
   if (n === null) return "";
   if (n === 0) return "today";
   if (n === 1) return "tomorrow";
   if (n === -1) return "yesterday";
   return n > 0 ? `in ${n} days` : `${-n} days ago`;
};

/** "Posted 3 days ago" style, for when something was created. */
export const postedAgo = (value) => {
   const n = daysUntil(value);
   if (n === null) return "";
   if (n === 0) return "Posted today";
   if (n === -1) return "Posted yesterday";
   return `Posted ${Math.abs(n)} days ago`;
};

/** First letter of a company/organiser name, for avatar tiles. */
export const initial = (name) => (name || "?").trim().charAt(0).toUpperCase();
