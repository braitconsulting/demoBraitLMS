@extends(getTemplate().'.layouts.app')

@push('styles_top')
    <link rel="stylesheet" href="/assets/default/vendors/swiper/swiper-bundle.min.css">
    <link rel="stylesheet" href="/assets/default/vendors/select2/select2.min.css">
@endpush


@section('content')
    <section class="site-top-banner search-top-banner opacity-04 position-relative">
        <img src="{{ getPageBackgroundSettings('categories') }}" class="img-cover" alt=""/>

        <div class="container h-100">
            <div class="row h-100 align-items-center justify-content-center text-center">
                <div class="col-12 col-md-9 col-lg-7">
                    <div class="top-search-categories-form">
                        <h1 class="text-white font-30 mb-15">{{ !empty($category) ? $category->title : $pageTitle }}</h1>
                        <span class="course-count-badge py-5 px-10 text-white rounded">{{ $webinarsCount }} {{ trans('product.courses') }}</span>

                        <div class="search-input bg-white p-10 flex-grow-1">
                            <form action="/search" method="get">
                                <div class="form-group d-flex align-items-center m-0">
                                    <input type="text" name="search" class="form-control border-0" placeholder="{{ trans('home.slider_search_placeholder') }}"/>
                                    <button type="submit" class="btn btn-primary rounded-pill">{{ trans('home.find') }}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="container-fluid mt-30">

        @if(!empty($featureWebinars) and !$featureWebinars->isEmpty())
            <section class="mb-25 mb-lg-0">
                <h2 class="font-24 text-dark-blue">{{ trans('home.featured_webinars') }}</h2>
                <span class="font-14 text-gray font-weight-400">{{ trans('site.newest_courses_subtitle') }}</span>
    
                <div class="position-relative mt-20">
                    <div class="swiper-container">
                        <div class="swiper-wrapper">
                            @foreach($featureWebinars as $featureWebinar)
                                <div class="swiper-slide">
                                    @include('web.default.includes.webinar.grid-card',['webinar' => $featureWebinar->webinar])
                                </div>
                            @endforeach
                        </div>
                    </div>
    
                    <div class="d-flex justify-content-center">
                        <div class="swiper-pagination"></div>
                    </div>
                </div>
            </section>
        @endif
    
        <section class="mt-lg-50 pt-lg-20 mt-md-40 pt-md-40 ">
            <form action="{{ $sortFormAction }}" method="get" id="filtersForm">
    
                @include('web.default.pages.includes.top_filters')
    
                <div class="row mt-20 justify-content-center">
                    <div class="col-12 col-lg-10"> 
                        @if(empty(request()->get('card')) or request()->get('card') == 'grid')
                            <div class="row">
                                @foreach($webinars as $webinar)
                                    <!-- Adjusted column width for four columns -->
                                    <div class="col-12 col-md-6 col-lg-3 mt-20">
                                        @include('web.default.includes.webinar.grid-card',['webinar' => $webinar])
                                    </div>
                                @endforeach
                            </div>
                        @elseif(!empty(request()->get('card')) and request()->get('card') == 'list')
                            @foreach($webinars as $webinar)
                                @include('web.default.includes.webinar.list-card',['webinar' => $webinar])
                            @endforeach
                        @endif
                    </div>
                </div>
    
            </form>
            <div class="mt-50 pt-30">
                {{ $webinars->appends(request()->input())->links('vendor.pagination.panel') }}
            </div>
        </section>
    </div>
    

@endsection

@push('scripts_bottom')
    <script src="/assets/default/vendors/select2/select2.min.js"></script>
    <script src="/assets/default/vendors/swiper/swiper-bundle.min.js"></script>

    <script src="/assets/default/js/parts/categories.min.js"></script>
@endpush
