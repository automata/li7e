/*** lexical grammar ***/

%lex
%%

"//".*                  /* ignore comment */
("->"|"=>")             return 'CONNECT';
":"                     return 'INSTANCE';
"."                     return '.';
","                     return ',';
"="                     return '=';
"["                     return '[';
"]"                     return ']';
"("                     return '(';
")"                     return ')';
"^"                     return '^';
"*"                     return '*';
"Infinity"	        return 'INFINITY';
[0-9]+("."[0-9]+)?      return 'NUMBER';
[a-zA-Z]+               return 'VAR';
\n+                     return 'NEWLINE';
\s+                     /* ignore whitespaces */
<<EOF>>                 return 'EOF';

/lex

/*** operador associations and precedences ***/

%left '^'
%left 'CONNECT'

%start script

/*** language grammar ***/
%%

script
	: expr_stmt EOF 
          { return ['Script'].concat([$1]); }
        ; 

expr_stmt
        : expr_stmt NEWLINE
        | expr
          { $$ = [$1]; }
        | expr_stmt expr
          { $$ = $1.concat([$2]); }
	;

expr
	: expr_ctrl
          { $$ = ['CtrlExpressions', $1]; }
	| expr_dsp
          { $$ = ['DspExpressions', $1]; }
	;

expr_dsp
        : instance
          { $$ = [$instance]; }
	| expr_dsp CONNECT instance
          { $$ = $1.concat([$3]); }
	;

instance
	: VAR INSTANCE VAR 
          { $$ = ['Instance', {obj: $1, class: $3}]; }
	;

expr_ctrl
	: VAR '.' msg 
          { $$ = [['Message', {target: $1, message: $3}]]; }
	;

msg
        : VAR '=' '[' list ']' '^' time
          { $$ = ['Attrib', {attribute: $1, pattern: $list, at: $time}]; }
        ;

list
	: NUMBER
          { $$ = [Number(yytext)]; } 
        | list ',' NUMBER
          { $$ = $1.concat(Number($3)); }
        ;

time
	: INFINITY 
          { $$ = yytext; }
	| NUMBER 
          { $$ = Number(yytext); }
	;

