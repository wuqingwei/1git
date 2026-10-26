/** Shared shortcut-modifier helpers for keyboard and click events.

On macOS the primary shortcut modifier is Command; on Linux (and
Windows) it is Control. GPUI reports the Linux Super key as `cmd`,
so a handler that only checks `cmd` still fires for Super+key on
Linux, but Linux users expect Ctrl+key. Handlers that accept the
primary shortcut must therefore check both, and user-visible labels
must name the key that actually works on the current platform.
*/

type ModifierEvent = {
	modifiers?: {
		cmd?: boolean;
		ctrl?: boolean;
	} | null;
};

/** Command on macOS, Control anywhere else. */
export function hasPrimaryModifier(event: ModifierEvent): boolean {
	return !!(event.modifiers?.cmd || event.modifiers?.ctrl);
}

/**
 * Exactly one primary modifier, not both and not neither. Use this
 * where the original handler required Command alone (and explicitly
 * rejected Control), so Ctrl+key replaces Cmd+key on Linux without
 * also firing for Cmd+Ctrl+key.
 */
export function hasExactlyOnePrimaryModifier(event: ModifierEvent): boolean {
	const cmd = !!event.modifiers?.cmd;
	const ctrl = !!event.modifiers?.ctrl;

	return cmd !== ctrl;
}

/** The name shown in shortcut labels: "Command" on macOS, "Ctrl" elsewhere. */
export const primaryModifierName =
	process.platform === "darwin" ? "Command" : "Ctrl";
