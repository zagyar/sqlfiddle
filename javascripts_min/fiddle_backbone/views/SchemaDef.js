define(["jQuery","Backbone","Handlebars","FiddleEditor","libs/renderTerminator","text!fiddle_backbone/templates/schemaOutput.html","text!fiddle_backbone/templates/schemaBrowser.html"],function(e,t,n,r,i,s,o){var u=t.View.extend({initialize:function(){this.editor=new r(this.id,this.handleSchemaChange,this),this.compiledOutputTemplate=n.compile(s),this.compiledSchemaBrowserTemplate=n.compile(o)},handleSchemaChange:function(){if(this.model.get("ddl")!=this.editor.getValue()||this.model.get("statement_separator")!=e(".panel.schema .terminator").data("statement_separator"))this.model.set({ddl:this.editor.getValue(),statement_separator:e(".panel.schema .terminator").data("statement_separator"),ready:!1}),e(".schema .helpTip").css("display",this.model.get("ddl").length?"none":"block"),e(".sql .helpTip").css("display",!this.model.get("ready")||this.model.get("loading")?"none":"block")},render:function(){this.editor.setValue(this.model.get("ddl")),this.updateDependents(),i(e(".panel.schema"),this.model.get("statement_separator"))},renderOutput:function(){this.options.output_el.html(this.compiledOutputTemplate(this.model.toJSON()))},renderSchemaBrowser:function(){this.options.browser_el.html(this.compiledSchemaBrowserTemplate({objects:this.model.get("schema_structure")}))},refresh:function(){this.editor.refresh()},updateDependents:function(){this.model.get("ready")?(e(".needsReadySchema").unblock(),e("#schemaBrowser").attr("disabled",!1),e(".schema .helpTip").css("display","none")):(e(".needsReadySchema").block({message:"Please build schema."}),e("#schemaBrowser").attr("disabled",!0),e(".schema .helpTip").css("display",this.model.get("loading")||this.model.get("ddl").length?"none":"block"))}});return u})