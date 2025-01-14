import { assert, assertEquals, sinon } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

Deno.test("[command] should execute the action from an option", async () => {
  const optionSpy = sinon.spy();

  const cmd = new Command()
    .throwErrors()
    .arguments("[beep:string]")
    .option("-f, --foo [value:string]", "action ...", { action: optionSpy });

  const { options, args } = await cmd.parse(["--foo", "bar", "beep"]);

  assert(optionSpy.calledOnce, "option action not called");
  assertEquals(optionSpy.firstCall.thisValue, cmd);
  assertEquals(optionSpy.firstCall.args, [{ foo: "bar" }, "beep"]);
  assertEquals(optionSpy.firstCall.args, [options, ...args]);
});

Deno.test("[command] should execute the action from an child command option", async () => {
  const optionSpy = sinon.spy();

  const subCmd = new Command()
    .arguments("[beep:string]")
    .option("-b, --bar [value:string]", "action ...", { action: optionSpy });

  const cmd = new Command()
    .throwErrors()
    .command("foo", subCmd);

  const { options, args } = await cmd.parse(["foo", "--bar", "baz", "beep"]);

  assert(optionSpy.calledOnce, "option action not called");
  assertEquals(optionSpy.firstCall.thisValue, subCmd);
  assertEquals(optionSpy.firstCall.args, [{ bar: "baz" }, "beep"]);
  assertEquals(optionSpy.firstCall.args, [options, ...args]);
});

Deno.test("[command] should execute the action from an option with dashed option name", async () => {
  const optionSpy = sinon.spy();

  const cmd = new Command()
    .throwErrors()
    .arguments("[beep:string] [boop:string]")
    .option("-f, --foo-bar", "action ...", { action: optionSpy });

  const { options, args } = await cmd.parse(["-f", "beep", "boop"]);

  assert(optionSpy.calledOnce, "option action not called");
  assertEquals(optionSpy.firstCall.thisValue, cmd);
  assertEquals(optionSpy.firstCall.args, [{ fooBar: true }, "beep", "boop"]);
  assertEquals(optionSpy.firstCall.args, [options, ...args]);
});

Deno.test("[command] should execute the action from an option with dashed option name and a value", async () => {
  const optionSpy = sinon.spy();

  const cmd = new Command()
    .throwErrors()
    .arguments("[beep:string]")
    .option("-f, --foo-bar [value:string]", "action ...", {
      action: optionSpy,
    });

  const { options, args } = await cmd.parse(["-f", "beep", "boop"]);

  assert(optionSpy.calledOnce, "option action not called");
  assertEquals(optionSpy.firstCall.thisValue, cmd);
  assertEquals(optionSpy.firstCall.args, [{ fooBar: "beep" }, "boop"]);
  assertEquals(optionSpy.firstCall.args, [options, ...args]);
});

Deno.test("[command] should execute the action from an option and the command action", async () => {
  const commandSpy = sinon.spy();
  const optionSpy = sinon.spy();

  const cmd = new Command()
    .throwErrors()
    .arguments("[beep:string]")
    .option("-f, --foo-bar [value:string]", "action ...", { action: optionSpy })
    .action(commandSpy);

  const { options, args } = await cmd.parse(["-f", "beep", "boop"]);

  assert(commandSpy.calledOnce, "command action not called");
  assertEquals(commandSpy.firstCall.thisValue, cmd);
  assertEquals(commandSpy.firstCall.args, [{ fooBar: "beep" }, "boop"]);
  assertEquals(commandSpy.firstCall.args, [options, ...args]);

  assert(optionSpy.calledOnce, "option action not called");
  assertEquals(optionSpy.firstCall.thisValue, cmd);
  assertEquals(optionSpy.firstCall.args, [{ fooBar: "beep" }, "boop"]);
  assertEquals(optionSpy.firstCall.args, [options, ...args]);
});

Deno.test("[command] should execute the action from an standalon option and but not the command action", async () => {
  const commandSpy = sinon.spy();
  const optionSpy = sinon.spy();

  const cmd = new Command()
    .throwErrors()
    .arguments("[beep:string]")
    .option("-f, --foo-bar [value:string]", "action ...", {
      standalone: true,
      action: optionSpy,
    })
    .action(commandSpy);

  const { options, args } = await cmd.parse(["-f", "beep", "boop"]);

  assert(commandSpy.notCalled, "command action called with standalone option");

  assert(optionSpy.calledOnce, "option action not called");
  assertEquals(optionSpy.firstCall.thisValue, cmd);
  assertEquals(optionSpy.firstCall.args, [{ fooBar: "beep" }, "boop"]);
  assertEquals(optionSpy.firstCall.args, [options, ...args]);
});
