/**
 * Covers: Linux Ctrl equivalents for macOS Cmd shortcuts.
 * Real: the shared modifier helpers and the two window shortcut
 * handlers that previously required Command alone.
 * Doubles: synthetic key events and WeakMap-registered shortcut
 * callbacks; no window, renderer, or native addon.
 * Requires: Bun only.
 */
import { expect, it, mock } from "bun:test";
import type { NativeRenderer } from "@gpuix/react";
import {
	hasExactlyOnePrimaryModifier,
	hasPrimaryModifier,
} from "../../src/platform/shortcut-modifiers";
import {
	handleRepositoryFilterKeyDown,
	handleWorkspaceKeyDown,
	repositoryFilterShortcuts,
	workspaceShortcuts,
} from "../../src/feature/repository-workspace/lib/repository-filter-shortcut";

type KeyEvent = Parameters<typeof handleWorkspaceKeyDown>[0];

const key = (
	overrides: Omit<Partial<KeyEvent>, "modifiers"> & {
		key: string;
		modifiers?: Partial<NonNullable<KeyEvent["modifiers"]>>;
	}
): KeyEvent => {
	const { modifiers, ...rest } = overrides;

	return {
		isHeld: false,
		...rest,
		modifiers: {
			cmd: false,
			ctrl: false,
			shift: false,
			alt: false,
			...modifiers,
		},
	} as KeyEvent;
};

const renderer = {} as NativeRenderer;

it("treats Command and Control both as the primary modifier, neither alone as none", () => {
	expect(hasPrimaryModifier(key({ key: "p", modifiers: { cmd: true } }))).toBe(
		true
	);
	expect(hasPrimaryModifier(key({ key: "p", modifiers: { ctrl: true } }))).toBe(
		true
	);
	expect(hasPrimaryModifier(key({ key: "p", modifiers: {} }))).toBe(false);
});

it("requires exactly one primary modifier for Command-only shortcuts", () => {
	expect(
		hasExactlyOnePrimaryModifier(key({ key: "p", modifiers: { cmd: true } }))
	).toBe(true);
	expect(
		hasExactlyOnePrimaryModifier(key({ key: "p", modifiers: { ctrl: true } }))
	).toBe(true);
	expect(
		hasExactlyOnePrimaryModifier(
			key({ key: "p", modifiers: { cmd: true, ctrl: true } })
		)
	).toBe(false);
	expect(hasExactlyOnePrimaryModifier(key({ key: "p", modifiers: {} }))).toBe(
		false
	);
});

it("dispatches workspace shortcuts for Ctrl+key as well as Cmd+key", () => {
	const dispatch = mock(() => {});

	workspaceShortcuts.set(renderer, dispatch);

	expect(
		handleWorkspaceKeyDown(
			key({ key: "p", modifiers: { ctrl: true } }),
			renderer
		)
	).toBe(true);
	expect(dispatch).toHaveBeenLastCalledWith("p");

	expect(
		handleWorkspaceKeyDown(
			key({ key: "p", modifiers: { cmd: true } }),
			renderer
		)
	).toBe(true);
	expect(dispatch).toHaveBeenCalledTimes(2);

	expect(
		handleWorkspaceKeyDown(key({ key: "p", modifiers: {} }), renderer)
	).toBe(false);
	expect(
		handleWorkspaceKeyDown(
			key({ key: "p", modifiers: { cmd: true, ctrl: true } }),
			renderer
		)
	).toBe(false);
	expect(
		handleWorkspaceKeyDown(
			key({ key: "p", modifiers: { ctrl: true, shift: true } }),
			renderer
		)
	).toBe(false);
});

it("opens the repository filter for Ctrl+F as well as Cmd+F", () => {
	const open = mock(() => true);

	repositoryFilterShortcuts.set(renderer, open);

	expect(
		handleRepositoryFilterKeyDown(
			key({ key: "f", modifiers: { ctrl: true } }),
			renderer
		)
	).toBe(true);
	expect(open).toHaveBeenLastCalledWith(false);

	expect(
		handleRepositoryFilterKeyDown(
			key({ key: "f", modifiers: { cmd: true } }),
			renderer
		)
	).toBe(true);
	expect(
		handleRepositoryFilterKeyDown(
			key({ key: "f", modifiers: { cmd: true, ctrl: true } }),
			renderer
		)
	).toBe(false);
});
