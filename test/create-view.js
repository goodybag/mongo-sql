var assert  = require('assert');
var builder = require('../');

describe('Built-In Query Types', function(){

  describe('Type: create view', function(){

    it('it should create a view', function(){
      var query = builder.sql({
        type: 'create-view'
      , view: 'jobs_gt_10'
      , expression: {
          type: 'select'
        , table: 'jobs'
        , where: { id: { $gt: 10 } }
        }
      });

      assert.equal(
        query.toString()
      , [ 'create view "jobs_gt_10" as '
        , 'select "jobs".* from "jobs" '
        , 'where "jobs"."id" > $1'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , [10]
      );
    });

    it('it should create or replace a view', function(){
      var query = builder.sql({
        type: 'create-view'
      , view: 'jobs_gt_10'
      , orReplace: true
      , expression: {
          type: 'select'
        , table: 'jobs'
        , where: { id: { $gt: 10 } }
        }
      });

      assert.equal(
        query.toString()
      , [ 'create or replace view "jobs_gt_10" as '
        , 'select "jobs".* from "jobs" '
        , 'where "jobs"."id" > $1'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , [10]
      );
    });

    it('it should create a temporary view', function(){
      var query = builder.sql({
        type: 'create-view'
      , view: 'jobs_gt_10'
      , temporary: true
      , expression: {
          type: 'select'
        , table: 'jobs'
        , where: { id: { $gt: 10 } }
        }
      });

      assert.equal(
        query.toString()
      , [ 'create temporary view "jobs_gt_10" as '
        , 'select "jobs".* from "jobs" '
        , 'where "jobs"."id" > $1'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , [10]
      );
    });

    it('it should create view with a specific column list', function(){
      var query = builder.sql({
        type: 'create-view'
      , view: 'jobs_gt_10'
      , columns: ['id', 'name']
      , expression: {
          type: 'select'
        , table: 'jobs'
        , where: { id: { $gt: 10 } }
        }
      });

      assert.equal(
        query.toString()
      , [ 'create view "jobs_gt_10" ("id", "name") as '
        , 'select "jobs".* from "jobs" '
        , 'where "jobs"."id" > $1'
        ].join('')
      );

      assert.deepEqual(
        query.values
      , [10]
      );
    });
  });
});