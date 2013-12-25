
<div class="name"><span class="label">Name:</span> <span class="value"><%= name %></span></div>
<div class="stats">
	<div class="kills"><span class="label">Kills:</span> <span class='value'><%= kills %></span></div>
	<div class="deaths"><span class="label">Deaths:</span> <span class='value'><%= deaths %></span></div>
	<div class="suicides"><span class="label">Suicides:</span> <span class='value'><%= suicides %></span></div>

</div>
<div class="health"><span class="label">Health:</span> <span class="value"><%= health %></span>/<span class="total"><%= totalHealth %></span></div>
<div class="width"><span class="label">Width:</span> <span class="value"><%= width %></span></div>
<div class="height"><span class="label">Height:</span> <span class="value"><%= height %></span></div>
<div class="aim"><span class="label">Aim:</span> <span class="value"><%= facing === 'left' ? '-' : '' %><%= aim %></span>&deg;</div>
<div class="weapons">
</div>
<div class="is-dead"><%= name %> is dead</div>

