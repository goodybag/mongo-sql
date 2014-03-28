
// ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
//     action [, ... ]
// ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
//     RENAME [ COLUMN ] column_name TO new_column_name
// ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
//     RENAME CONSTRAINT constraint_name TO new_constraint_name
// ALTER TABLE [ IF EXISTS ] name
//     RENAME TO new_name
// ALTER TABLE [ IF EXISTS ] name
//     SET SCHEMA new_schema

// where action is one of:

//     ADD [ COLUMN ] column_name data_type [ COLLATE collation ] [ column_constraint [ ... ] ]
//     DROP [ COLUMN ] [ IF EXISTS ] column_name [ RESTRICT | CASCADE ]
//     ALTER [ COLUMN ] column_name [ SET DATA ] TYPE data_type [ COLLATE collation ] [ USING expression ]
//     ALTER [ COLUMN ] column_name SET DEFAULT expression
//     ALTER [ COLUMN ] column_name DROP DEFAULT
//     ALTER [ COLUMN ] column_name { SET | DROP } NOT NULL
//     ALTER [ COLUMN ] column_name SET STATISTICS integer
//     ALTER [ COLUMN ] column_name SET ( attribute_option = value [, ... ] )
//     ALTER [ COLUMN ] column_name RESET ( attribute_option [, ... ] )
//     ALTER [ COLUMN ] column_name SET STORAGE { PLAIN | EXTERNAL | EXTENDED | MAIN }
//     ADD table_constraint [ NOT VALID ]
//     ADD table_constraint_using_index
//     VALIDATE CONSTRAINT constraint_name
//     DROP CONSTRAINT [ IF EXISTS ]  constraint_name [ RESTRICT | CASCADE ]
//     DISABLE TRIGGER [ trigger_name | ALL | USER ]
//     ENABLE TRIGGER [ trigger_name | ALL | USER ]
//     ENABLE REPLICA TRIGGER trigger_name
//     ENABLE ALWAYS TRIGGER trigger_name
//     DISABLE RULE rewrite_rule_name
//     ENABLE RULE rewrite_rule_name
//     ENABLE REPLICA RULE rewrite_rule_name
//     ENABLE ALWAYS RULE rewrite_rule_name
//     CLUSTER ON index_name
//     SET WITHOUT CLUSTER
//     SET WITH OIDS
//     SET WITHOUT OIDS
//     SET ( storage_parameter = value [, ... ] )
//     RESET ( storage_parameter [, ... ] )
//     INHERIT parent_table
//     NO INHERIT parent_table
//     OF type_name
//     NOT OF
//     OWNER TO new_owner
//     SET TABLESPACE new_tablespace

// and table_constraint_using_index is:

//     [ CONSTRAINT constraint_name ]
//     { UNIQUE | PRIMARY KEY } USING INDEX index_name
//     [ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ]

var assert  = require('assert');
var builder = require('../');

describe('Built-In Query Types', function(){

  describe('Type: alter table', function(){

    it('should alter a table', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      });

      assert.equal(
        query.toString()
      , [ 'alter table "users"'
        ].join('')
      );
    });

    it('should alter a table if it exists', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      , ifExists: true
      });

      assert.equal(
        query.toString()
      , [ 'alter table if exists "users"'
        ].join('')
      );
    });

    it('should alter a table only', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      , only: true
      });

      assert.equal(
        query.toString()
      , [ 'alter table only "users"'
        ].join('')
      );
    });

    it('should rename a table', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      , action: {
          rename: 'consumers'
        }
      });

      assert.equal(
        query.toString()
      , [ 'alter table "users" rename to "consumers"'
        ].join('')
      );
    });

    it('should rename a column', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      , action: {
          renameColumn: {
            from: 'id'
          , to:   'uid'
          }
        }
      });

      assert.equal(
        query.toString()
      , [ 'alter table "users" rename column "id" to "uid"'
        ].join('')
      );
    });

    it('should rename a constraint', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      , action: {
          renameConstraint: {
            from: 'id_idx'
          , to:   'uid_idx'
          }
        }
      });

      assert.equal(
        query.toString()
      , [ 'alter table "users" rename constraint "id_idx" to "uid_idx"'
        ].join('')
      );
    });

    it('should set schema', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      , action: {
          setSchema: 'newSchema'
        }
      });

      assert.equal(
        query.toString()
      , [ 'alter table "users" set schema "newSchema"'
        ].join('')
      );
    });

    it('should perform multiple actions', function(){
      var query = builder.sql({
        type: 'alter-table'
      , table: 'users'
      , action: [
          { dropConstraint: { name: 'users_pkey' } }
        , { addConstraint: { name: 'users_pkey', primaryKey: [ 'id', 'name' ] } }
        , { addConstraint: { name: 'users_stuff_key', unique: 'name' } }
        , { alterColumn: { name: 'createdAt', default: 'now()' } }
        ]
      });

      assert.equal(
        query.toString()
      , [ 'alter table "users" '
        , 'drop constraint "users_pkey", '
        , 'add constraint "users_pkey" primary key ("id", "name"), '
        , 'add constraint "users_stuff_key" unique ("name"), '
        , 'alter column "createdAt" set default now()'
        ].join('')
      );
    });

    /**
     * Add Column
     ******************
     ******************
     */
    describe('Add Column', function(){

      it('should add a new column', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int'
          ].join('')
        );
      });

      it('should add a new column not null', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , notNull: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int not null'
          ].join('')
        );
      });

      it('should add a new column null', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , null: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int null'
          ].join('')
        );
      });

      it('should add a new column as primary key', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , primaryKey: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int primary key'
          ].join('')
        );
      });

      it('should add a new column with unique constraint', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , unique: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int unique'
          ].join('')
        );
      });

      it('should add a new column with a check', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , check: { groupId: { $gt: 7 } }
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int check ("users"."groupId" > $1)'
          ].join('')
        );
      });

      it('should add a new column with a default', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , default: 'now()'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int default now()'
          ].join('')
        );
      });

      it('should add a new column with a reference', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , references: 'groups'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int references "groups"'
          ].join('')
        );
      });

      it('should add a new column with a column specific reference', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , references: {
                table: 'groups'
              , column: 'id'
              }
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int references "groups"("id")'
          ].join('')
        );
      });

      it('should add a new column with a reference with delete behavior', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , references: {
                table: 'groups'
              , column: 'id'
              , onDelete: 'cascade'
              }
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int references "groups"("id") on delete cascade'
          ].join('')
        );
      });

      it('should add a new column with a reference with update behavior', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , references: {
                table: 'groups'
              , column: 'id'
              , onUpdate: 'set null'
              }
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int references "groups"("id") on update set null'
          ].join('')
        );
      });

      it('should add a new column with a reference with match behavior', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , references: {
                table: 'groups'
              , column: 'id'
              , match: 'full'
              }
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" int references "groups"("id") match full'
          ].join('')
        );
      });

      it('should add a new column with all restraints', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            addColumn: {
              name: 'groupId'
            , type: 'int'
            , notNull: true
            , check: {
                groupId: { $gt: 100 }
              }
            , default: 'now()'
            , unique: true
            , primaryKey: true
            , references: {
                table: 'groups'
              , column: 'id'
              , match: 'partial'
              }
            , deferrable: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" add column "groupId" '
          , 'int '
          , 'not null '
          , 'check ("users"."groupId" > $1) '
          , 'default now() '
          , 'unique '
          , 'primary key '
          , 'references "groups"("id") '
          , 'match partial '
          , 'deferrable'
          ].join('')
        );
      });
    });

    /**
     * Alter Column
     ******************
     ******************
     */
    describe('Alter Column', function(){

      it('should alter a column changing the type', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'groupId'
            , type: 'text'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "groupId" type text'
          ].join('')
        );
      });

      it('should alter a column changing the type adding a using expression', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'groupId'
            , type: 'text'
            , using: 'null'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "groupId" type text using (null)'
          ].join('')
        );
      });

      it('should alter a column changing the default', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'createdAt'
            , default: 'now()'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "createdAt" set default now()'
          ].join('')
        );
      });

      it('should alter a column dropping the default', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'createdAt'
            , dropDefault: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "createdAt" drop default'
          ].join('')
        );
      });

      it('should alter a column adding not null constraint', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'createdAt'
            , notNull: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "createdAt" set not null'
          ].join('')
        );
      });

      it('should alter a column dropping not null constraint', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'createdAt'
            , notNull: false
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "createdAt" drop not null'
          ].join('')
        );
      });

      it('should alter a column setting statistics', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'createdAt'
            , statistics: 5
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "createdAt" set statistics $1'
          ].join('')
        );
      });

      it('should alter a column setting storage', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: {
              name: 'createdAt'
            , storage: 'external'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" alter column "createdAt" set storage external'
          ].join('')
        );
      });

      it('should perform multiple alter columns', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            alterColumn: [
              { name: 'createdAt', storage: 'external' }
            , { name: 'createdAt', notNull: true }
            , { name: 'createdAt', default: 'now()' }
            ]
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" '
          , 'alter column "createdAt" set storage external, '
          , 'alter column "createdAt" set not null, '
          , 'alter column "createdAt" set default now()'
          ].join('')
        );
      });
    });

    describe('add/drop constraint', function(){

      it('should drop a constraint', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'distributors'
        , action: {
            dropConstraint: 'zipchk'
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "distributors" '
          , 'drop constraint "zipchk"'
          ].join('')
        );
      });

      it('should drop a constraint with all options', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'distributors'
        , action: {
            dropConstraint: {
              name: "zipchk"
            , ifExists: true
            , cascade: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "distributors" '
          , 'drop constraint if exists "zipchk" cascade'
          ].join('')
        );
      });

      it('should add a check constraint', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'distributors'
        , action: {
            addConstraint: {
              name: 'zipchk'
            , check: { $custom: ['char_length(zipcode) = $1', 5] }
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "distributors" '
          , 'add constraint "zipchk" '
          , 'check (char_length(zipcode) = $1)'
          ].join('')
        );

        assert.deepEqual(
          query.values
        , [5]
        );
      });

      it('should add a foreign key constraint', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'distributors'
        , action: {
            addConstraint: {
              name: 'distfk'
            , foreignKey: {
                column: 'address'
              , references: {
                  table: 'addresses'
                , column: 'address'
                }
              }
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "distributors" '
          , 'add constraint "distfk" foreign key ("address") '
          , 'references "addresses"("address")'
          ].join('')
        );
      });

      it('should add a unique constraint', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'distributors'
        , action: {
            addConstraint: {
              name: 'dist_id_zipcode_key'
            , unique: ['dist_id', 'zipcode']
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "distributors" '
          , 'add constraint "dist_id_zipcode_key" '
          , 'unique ("dist_id", "zipcode")'
          ].join('')
        );
      });
    });

    describe('drop column', function(){
      it('should drop a column', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            dropColumn: {
              name: 'groupId'
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" '
          , 'drop column "groupId"'
          ].join('')
        );
      });

      it('should if exists drop a column restrict', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            dropColumn: {
              name: 'groupId'
            , ifExists: true
            , restrict: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" '
          , 'drop column if exists "groupId" '
          , 'restrict'
          ].join('')
        );
      });

      it('should drop a column cascade', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            dropColumn: {
              name: 'groupId'
            , cascade: true
            }
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" '
          , 'drop column "groupId" '
          , 'cascade'
          ].join('')
        );
      });

      it('should drop multiple columns', function(){
        var query = builder.sql({
          type: 'alter-table'
        , table: 'users'
        , action: {
            dropColumn: [
              { name: 'groupId'
              , ifExists: true
              , restrict: true
              }
            , { name: 'itemId'
              , cascade: true
              }
            , { name: 'horseId' }
            ]
          }
        });

        assert.equal(
          query.toString()
        , [ 'alter table "users" '
          , 'drop column if exists "groupId" restrict, '
          , 'drop column "itemId" cascade, '
          , 'drop column "horseId"'
          ].join('')
        );
      });

    });

  });
});
