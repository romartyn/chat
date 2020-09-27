@extends('layouts.app')

@section('content')
<div class="container">
	<div class="row justify-content-center">
		<div class="col-md-8">
			<div class="card">
				<div class="card-header">Some header</div>

				<div class="card-body">
					<div id="chat"></div>
				</div>
			</div>
		</div>
	</div>
</div>
@endsection

@section('javascript')
	<script>
		let user = @json(\Auth::user());
	</script>
	<script src="{{ mix('js/chat/index.js') }}"></script>
@endsection
