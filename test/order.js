var assert  = require('assert');
var builder = require('../');

describe('Order', function() {
    it('should build a query with order correct from string', function () {
        var query = builder.sql({
            type: 'select'
            , table: 'users'
            , order: "col1 desc"
        });

        assert.equal(
            query.toString()
            , 'select "users".* from "users" order by col1 desc'
        );

    });

    it('should build a query with order correct from string array', function () {
        var query = builder.sql({
            type: 'select'
            , table: 'users'
            , order: ["col1", "col2 desc"]
        });

        assert.equal(
            query.toString()
            , 'select "users".* from "users" order by col1, col2 desc'
        );

    });

    it('should build a query with order correct from object', function () {
        var query = builder.sql({
            type: 'select'
            , table: 'users'
            , order: {
                col1: "asc",
                col2: "desc"
            }
        });

        assert.equal(
            query.toString()
            , 'select "users".* from "users" order by "users"."col1" asc, "users"."col2" desc'
        );

    });
});
