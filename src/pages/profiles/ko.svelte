<script>
var USER_ID = {{ user.id }};
var USER_NAME = {{ user.name | tojson }};
var TEAM_ID = {{ user.team_id | tojson }};
var stats_data = {{ {
	'type': 'user',
	'id': user.id,
	'name': user.name,
	'account_id': user.id,
} | tojson }};
</script>