define(["jQuery","QUnit","DDLBuilder/ddl_builder"],function(e,t,n){return function(r,i){var s=new n({ddlTemplate:"{{#each_with_index columns}}{{#if index}},{{/if}}{{db_type}}{{/each_with_index}}}"});t.equal(s.parse(e("#"+r).html()),i,"Column types")}})