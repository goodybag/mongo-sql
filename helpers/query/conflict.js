// [ WITH [ RECURSIVE ] with_query [, ...] ]
// INSERT INTO table_name [ AS alias ] [ ( column_name [, ...] ) ]
//     { DEFAULT VALUES | VALUES ( { expression | DEFAULT } [, ...] ) [, ...] | query }
//     [ ON CONFLICT [ conflict_target ] conflict_action ]
//     [ RETURNING * | output_expression [ [ AS ] output_name ] [, ...] ]

// where conflict_target can be one of:

//     ( { index_column_name | ( index_expression ) } [ COLLATE collation ] [ opclass ] [, ...] ) [ WHERE index_predicate ]
//     ON CONSTRAINT constraint_name

// and conflict_action is one of:

//     DO NOTHING
//     DO UPDATE SET { column_name = { expression | DEFAULT } |
//                     ( column_name [, ...] ) = ( { expression | DEFAULT } [, ...] ) |
//                     ( column_name [, ...] ) = ( sub-SELECT )
//                   } [, ...]
//               [ WHERE condition ]

var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register( 'conflict', function( conflict, values, query ){
  var result = 'on conflict';

  // Handle target specification
  if ( conflict.target ){
    // Users can just pass in a big ol' target string
    if ( typeof conflict.target === 'string' ){
      result += '(' + conflict.target + ') ';
    // Or get more specific
    } else {
      if ( conflict.target.column ){
        console.log('conflict.target.column is deprecated. Use an array of columns on conflict.target.columns instead');
        conflict.target.columns = [ conflict.target.column ];
      }

      // Handle (index_column_name | (index_expression))
      if ( Array.isArray( conflict.target.columns ) ){
        var columnExpression = '(' + conflict.target.columns.map(function( column ){
          return utils.quoteObject( column );
        }).join(', ');

        if ( conflict.target.expression ){
          columnExpression += '(' + conflict.target.expression + ') ';
        }

        // Collation
        if ( conflict.target.collation ){
          columnExpression += ' collate ' + conflict.target.collation;
        }

        // Opclasses either string or array of strings
        if ( conflict.target.opclass ){
          if ( Array.isArray( conflict.target.opclass ) ){
            columnExpression += ' ' + conflict.target.opclass.join(', ');
          } else {
            columnExpression += ' ' + conflict.target.opclass;
          }
        }

        columnExpression += ')';

        result += ' ' + columnExpression;
      }

      // Where condition doesn't need a table name
      if ( conflict.target.where ){
        result += ' ' + helpers.get('where').fn( conflict.target.where, values, query );
      }

      // Constraint
      if ( conflict.target.constraint ){
        result += ' on constraint ' + utils.quoteObject( conflict.target.constraint );
      }
    }
  }

  if ( conflict.action ){
    result += ' do ';

    if ( typeof conflict.action === 'string' ){
      result += conflict.action;
    } else if ( conflict.action.update ){
      result += 'update ';
      result += helpers.get('updates').fn( conflict.action.update, values, query );

      if ( conflict.action.where ){
        result += ' ' + helpers.get('where').fn( conflict.action.where, values, query );
      }
    }
  }

  return result;
});
