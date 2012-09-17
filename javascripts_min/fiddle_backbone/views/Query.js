define(["jQuery","Backbone","Handlebars","FiddleEditor","libs/renderTerminator","XPlans/oracle/loadswf","XPlans/mssql","text!fiddle_backbone/templates/queryTabularOutput.html","text!fiddle_backbone/templates/queryPlaintextOutput.html","HandlebarsHelpers/divider_display","HandlebarsHelpers/each_simple_value_with_index","HandlebarsHelpers/each_with_index","HandlebarsHelpers/result_display_padded","HandlebarsHelpers/result_display"],function(e,t,n,r,i,s,o,u,a){var f=t.View.extend({initialize:function(){this.editor=new r(this.id,this.handleQueryChange,this),this.outputType="tabular",this.compiledOutputTemplate={},this.compiledOutputTemplate.tabular=n.compile(u),this.compiledOutputTemplate.plaintext=n.compile(a)},setOutputType:function(e){this.outputType=e},handleQueryChange:function(){var t=this.model.get("schemaDef");this.model.set({sql:this.editor.getValue()}),e(".sql .helpTip").css("display",!t.get("ready")||t.get("loading")||this.model.get("sql").length?"none":"block")},render:function(){this.editor.setValue(this.model.get("sql")),this.model.id&&this.renderOutput(),i(e(".panel.sql"),this.model.get("statement_separator"))},renderOutput:function(){var t=this.model,n=this.model.toJSON();_.each(n.sets,function(e,t){if(e.RESULTS){var r=_.map(e.RESULTS.COLUMNS,function(e){return e.length});_.each(e.RESULTS.DATA,function(e){r=_.map(e,function(e,t){return _.max([e.toString().length,r[t]])})}),n.sets[t].RESULTS.COLUMNWIDTHS=r}}),n.schemaDef=this.model.get("schemaDef").toJSON(),n.schemaDef.dbType=this.model.get("schemaDef").get("dbType").toJSON(),n.schemaDef.dbType.isSQLServer=this.model.get("schemaDef").get("dbType").get("simple_name")=="SQL Server",this.options.output_el.html(this.compiledOutputTemplate[this.outputType](n)),e("script.oracle_xplan_xml").each(function(){e(this).siblings("div.oracle_xplan").html(s(e(this).text()))}),this.options.output_el.find("a.executionPlanLink").click(function(n){n.preventDefault(),e("i",this).toggleClass("icon-minus icon-plus"),e(this).closest(".set").find(".executionPlan").toggle(),e("i",this).hasClass("icon-minus")&&t.get("schemaDef").get("dbType").get("simple_name")=="SQL Server"&&o.drawLines(e(this).closest(".set").find(".executionPlan div"))})},refresh:function(){this.editor.refresh()},checkForSelectedText:function(){this.editor.somethingSelected()?this.model.set("sql",this.editor.getSelection()):this.model.set("sql",this.editor.getValue())}});return f})