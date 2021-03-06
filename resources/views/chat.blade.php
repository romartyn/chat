@extends('layouts.app')

@section('content')
<div class="container">
	<div class="row justify-content-center">
		<div class="col-md-12">
			<div class="card">
				<div class="card-header">Some header</div>

				<div class="card-body">
					<div id="chat"></div>
				</div>

				<div class="card-footer">
					{{-- <div class="row"> --}}
						<div id="attaches"></div>
					{{-- </div> --}}
				</div>
			</div>
		</div>
	</div>
</div>
@endsection

@section('javascript')
	<script src="/assets/js/WebAudioRecorder.min.js"></script>
	<script>
		let user = @json(\Auth::user());
		let users = @json(\App\Models\User::query()->select('id','name')->get());
	</script>
	<script src="{{ mix('js/chat/index.js') }}"></script>
@endsection
