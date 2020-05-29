import { stripeColors } from '../../../table/lib/utils.ts';
import { Command } from '../../lib/command.ts';
import { assertEquals } from '../lib/assert.ts';

function command(): Command {
    return new Command()
        .throwErrors()
        .version( '1.0.0' )
        .description( 'Test description ...' )
        .command( 'hidden-command <input:string> <output:string>' )
        .hidden();
}

Deno.test( 'hidden command', async () => {

    const cmd: Command = command();
    const { options, args } = await cmd.parse( [ 'hidden-command', 'input-path', 'output-path' ] );

    assertEquals( options, {} );
    assertEquals( args[ 0 ], 'input-path' );
    assertEquals( args[ 1 ], 'output-path' );
} );

Deno.test( 'hidden command help', async () => {

    const cmd: Command = command();
    const output: string = cmd.getHelpCommand().getHelp();

    assertEquals( stripeColors( output ), `
  Usage:   COMMAND
  Version: v1.0.0 

  Description:

    Test description ...

  Options:

    -h, --help     [arg:boolean]  - Show this help.                            
    -V, --version  [arg:boolean]  - Show the version number for this program.  

  Commands:

    help         [command:command]  - Show this help or the help of a sub-command.
    completions                     - Generate shell completions for zsh and bash.

` );
} );