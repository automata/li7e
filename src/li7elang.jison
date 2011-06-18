/* example:
~ saw:Saw -> filter:LowPassFilter -> gain:Gain -> output:Output
~ frequencyLFO:Sine -> filterMA:MulAdd -> filter:LowPassFilter
~ env:ADSREnvelope -> gain:Gain

! frequencyMA.frequency = [55 55 98 98 73 73 98 98]^Infinity
! frequencyLFO.frequency = [2 4 6 8]^Infinity
! env.gate = [1 0]^Infinity
*/

/*** lexical grammar ***/

%lex
%%

\s+                      /* ignore whitespaces */
"~"                      return 'DSP_COMMAND';
"!"                      return 'CTRL_COMMAND';
"->"                     return 'CONNECT';
":"                      return ':';
"."                      return '.';
"="                      return '=';
"["                      return '[';
"]"                      return ']';
"("                      return '(';
")"                      return ')';
"^"                      return '^';
"*"                      return '*';
[0-9]+("."[0-9]+)?       return 'NUMBER';
[a-zA-Z]+                return 'IDENT';
<<EOF>>                  return 'EOF';

/lex

/*** operador associations and precedences ***/

%left '->'
%left '^'

%start expressions

/*** language grammar ***/

%%

expressions
   : e EOF
       { print($1); }
   ;

e
   : e '->' e
       { print(e, 'conectou a', e); }
   | IDENT
       { print(yytext, 'ident'); }
   ;
