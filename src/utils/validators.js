export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateSignup(values) {
  const errors = {};

  if (!values.fullName?.trim()) errors.fullName = "Full name is required.";
  if (!values.email?.trim()) errors.email = "Email is required.";
  if (values.email && !isValidEmail(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.password) errors.password = "Password is required.";
  if (values.password && values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  }
  if (
    values.password &&
    values.confirmPassword &&
    values.password !== values.confirmPassword
  ) {
    errors.confirmPassword = "Passwords must match.";
  }

  return errors;
}

export function validateLogin(values) {
  const errors = {};

  if (!values.email?.trim()) errors.email = "Email is required.";
  if (values.email && !isValidEmail(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.password) errors.password = "Password is required.";

  return errors;
}

export function validateProjectTemplate(values) {
  const messages = [];
  const milestones = Array.isArray(values.milestones)
    ? values.milestones
    : String(values.milestones || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  if (!values.name?.trim()) messages.push("Project Name is required.");
  if (!values.owner?.trim()) messages.push("Team Lead is required.");
  if (!milestones.length) messages.push("At least one milestone is required.");
  if (!values.startDate) messages.push("Start Date is required.");
  if (!values.endDate) messages.push("End Date is required.");
  if (
    values.startDate &&
    values.endDate &&
    new Date(values.endDate) < new Date(values.startDate)
  ) {
    messages.push("End Date must be after Start Date.");
  }

  const template = values.templateType || "Standard";
  let requiredMilestones = [];

  if (template === "Software Release") {
    requiredMilestones = ["Requirements", "Development", "Testing", "Deployment"];
    if (values.startDate && values.endDate) {
      const days =
        (new Date(values.endDate) - new Date(values.startDate)) /
        (1000 * 60 * 60 * 24);
      if (days < 14) {
        messages.push("Software Release project timeline must be at least 14 days.");
      }
    }
  } else if (template === "Marketing Campaign") {
    requiredMilestones = ["Research", "Content Creation", "Launch", "Reporting"];
  } else if (template === "Product Launch") {
    requiredMilestones = ["PR", "Beta Test", "Launch Event", "Feedback"];
    if (!values.description || values.description.trim().length < 30) {
      messages.push(
        "Product Launch template requires a descriptive scope of at least 30 characters."
      );
    }
  }

  const missingRequiredMilestones = requiredMilestones.filter(
    (req) => !milestones.some((m) => m.toLowerCase() === req.toLowerCase())
  );

  if (missingRequiredMilestones.length) {
    messages.push(
      `Template requires missing milestones: ${missingRequiredMilestones.join(", ")}`
    );
  }

  return {
    approved: messages.length === 0,
    messages,
    requiredMilestones,
    missingRequiredMilestones,
    templateType: template,
  };
}

export function hasDependencyCycle(taskId, proposedBlockedBy, allTasks) {
  const adj = new Map();

  allTasks.forEach((t) => {
    if (t.id === taskId) {
      adj.set(t.id, proposedBlockedBy || []);
    } else {
      adj.set(t.id, t.blockedBy || []);
    }
  });

  if (taskId && !adj.has(taskId)) {
    adj.set(taskId, proposedBlockedBy || []);
  }

  const visited = new Set();
  const recStack = new Set();

  function dfs(node) {
    if (recStack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);

    const neighbors = adj.get(node) || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) return true;
    }

    recStack.delete(node);
    return false;
  }

  for (const node of adj.keys()) {
    if (dfs(node)) return true;
  }
  return false;
}
