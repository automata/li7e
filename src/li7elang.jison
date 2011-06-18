/*** lexical grammar ***/

%lex
%%

\s+                     /* ignore whitespaces */
"//".*                  /* ignore comment */
"~"                      return 'DSP_COMMAND';
"!"                       return 'CTRL_COMMAND';
"->"                     return 'CONNECT';
":"                        return 'INSTANCE';
"."                        return '.';
"="                      return '=';
"["                       return '[';
"]"                       return ']';
"("                       return '(';
")"                       return ')';
"^"                      return '^';
"*"                       return '*';
"Infinity"	    return 'INFINITY';
[0-9]+("."[0-9]+)?   return 'NUMBER';
[a-zA-Z]+                  return 'VAR';
<<EOF>>                 return 'EOF';

/lex

/*** operador associations and precedences ***/


%left CTRL_COMMAND
%left DSP_COMMAND
%left '^'
%left CONNECT
% left INSTANCE

%start expressions

/*** language grammar ***/
%%

expressions
	: expr EOF { print($1); }
	;

expr
	:  DSP_COMMAND expr_dsp
	| CTRL_COMMAND expr_ctrl
	;

expr_dsp
	: expr_dsp CONNECT expr_dsp 
	| instancia
	;
instancia
	: inst INSTANCE classe
	;

inst
	: VAR  { $$ = yytext; }
	; 

classe
	: VAR  { $$ = yytext; }
	;

expr_ctrl
	: VAR '.' VAR '=' '[' matriz ']' '^' time
	;

matriz
	: NUMBER matriz
	| NUMBER {$$ = Number(yytext);}
	;

time
	: INFINITY {$$ = Number(yytext);}
	| NUMBER {$$ = Number(yytext);}
	;

/* example:
~ saw:Saw -> filter:LowPassFilter -> gain:Gain -> output:Output
~ frequencyLFO:Sine -> filterMA:MulAdd -> filter:LowPassFilter
~ env:ADSREnvelope -> gain:Gain

! frequencyMA.frequency = [55 55 98 98 73 73 98 98]^Infinity
! frequencyLFO.frequency = [2 4 6 8]^Infinity
! env.gate = [1 0]^Infinity
*/
