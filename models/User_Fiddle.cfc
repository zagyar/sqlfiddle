<cfcomponent extends="Model">
	<cfscript>
	function init() {
		belongsTo(name="Schema_Def", foreignKey="schema_def_id");
		belongsTo(name="Query", foreignKey="query_id", joinType="outer");
	}
	
	function logAccess(numeric schema_def_id, query_id = "") {
			
		if (StructKeyExists(session, "user"))
		{
			if (IsNumeric(arguments.query_id))
			{
				lock timeout="60" name="log_#session.user.id#_#arguments.schema_def_id#_#arguments.query_id#" type="exclusive"     
				{
					local.alreadyExists = model("User_Fiddles").findOne(where="user_id=#session.user.id# AND schema_def_id=#arguments.schema_def_id# AND query_id=#arguments.query_id#");
					if (IsObject(local.alreadyExists))
					{
						local.alreadyExists.last_accessed = now();
						local.alreadyExists.num_accesses++;
						local.alreadyExists.save();
					}
					else
					{
						model("User_Fiddles").create({
							"user_id" = session.user.id,
							"schema_def_id" = arguments.schema_def_id,
							"query_id" = arguments.query_id
						});
					}
				}
			}
			else
			{
				lock timeout="60" name="log_#session.user.id#_#arguments.schema_def_id#" type="exclusive"     
				{
					local.alreadyExists = model("User_Fiddles").findOne(where="user_id=#session.user.id# AND schema_def_id=#arguments.schema_def_id# AND query_id IS NULL");
					if (IsObject(local.alreadyExists))
					{
						local.alreadyExists.last_accessed = now();
						local.alreadyExists.num_accesses++;
						local.alreadyExists.save();
					}
					else
					{
						model("User_Fiddles").create({
							"user_id" = session.user.id,
							"schema_def_id" = arguments.schema_def_id
						});
					}
				}				
			}
		}
		
	}
	
	</cfscript>
	
	<cffunction name="findFiddles">
		<cfargument name="user_id" type="numeric" required="true">
		
		<cfquery name="local.fiddles" datasource="#get('dataSourceName')#">
		SELECT
			mySchemas.most_recent_schema_access,
			mySchemas.my_query_count,
			mySchemas.full_name,
			mySchemas.context,
			mySchemas.ddl,
			cast(mySchemas.db_type_id as varchar) || '/' || mySchemas.short_code as schema_fragment,
			mySchemas.db_type_id,
			mySchemas.short_code,
			mySchemas.schema_def_id,
			mySchemas.owner_id,
			mySchemas.user_id,
			mySchemas.structure_json,
			
			uf.last_accessed as most_recent_query_access,
			uf.query_id,
			
			q.sql as full_sql,
			
			qs.id as set_id,
			qs.row_count,
			qs.succeeded,
			qs.sql,
			qs.error_message,
			qs.columns_list
		FROM
		(
			SELECT
				max(uf.last_accessed) as most_recent_schema_access,
				count(uf.query_id) as my_query_count,
				d.full_name,
				d.context,
				sd.db_type_id,
				sd.short_code,
				sd.ddl,
				sd.id as schema_def_id,
				sd.structure_json,
				sd.owner_id,
				uf.user_id
			FROM
				User_Fiddles uf
					INNER JOIN Schema_Defs sd ON
						uf.schema_def_id = sd.id
					INNER JOIN DB_Types d ON
						sd.db_type_id = d.id
			WHERE
				uf.user_id = <cfqueryparam value="#arguments.user_id#" cfsqltype="cf_sql_integer">
			GROUP BY
				d.full_name,
				d.context,
				sd.db_type_id,
				sd.short_code,
				sd.ddl,
				sd.id,
				sd.owner_id,
				uf.user_id
		) mySchemas
			LEFT OUTER JOIN User_Fiddles uf ON
				mySchemas.schema_def_id = uf.schema_def_id AND
				mySchemas.user_id = uf.user_id
			LEFT OUTER JOIN Queries q ON
				uf.schema_def_id = q.schema_def_id AND
				uf.query_id = q.id
			LEFT OUTER JOIN Query_Sets qs ON
				uf.schema_def_id = qs.schema_def_id AND
				uf.query_id = qs.query_id
		WHERE
			uf.query_id IS NOT NULL

			
		ORDER BY
			most_recent_schema_access DESC,
			most_recent_query_access DESC,
			qs.id
		</cfquery>
		
		<cfreturn local.fiddles>
	</cffunction>
	
</cfcomponent>