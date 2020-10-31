<template><div id="dashboard">
    <b-row>

        <!-- Author Leaderboard -->
        <b-col size="sm"><b-card title="Top Authors">
            <b-card-text>
                <Loading v-if="authorLeaderboard.displayLoading" />
                <PageError  v-if="authorLeaderboard.displayError" :errorMessage="authorLeaderboard.errorMessage" />
                <apexchart v-if="authorLeaderboard.dispayChart" type="bar" :options="authorLeaderboard.options" :series="authorLeaderboard.series" />
            </b-card-text>
        </b-card></b-col>

        <!-- Book Leaderboard -->
        <b-col size="sm"><b-card title="Top Books">
            <b-card-text>Widget 2</b-card-text>
        </b-card></b-col>

        <!-- Tag Leaderboard -->
        <b-col size="sm"><b-card title="Top Tags">
            <b-card-text>Widget 3</b-card-text>
        </b-card></b-col>

    </b-row>
</div></template>

<script>
import pageHelpers from '../Mixins/pageHelpers';
export default {
    name: "Dashboard",
    data: function() { return {
        authorLeaderboard: {
            displayError: false,
            displayLoading: true,
            dispayChart: false,
            errorMessage: 'Could not load',
            options: {
                chart: {
                    toolbar: { show: false },
                },
                grid: {
                    yaxis: {
                        lines: { show: false },
                    },
                },
                title: {
                    align: 'center',
                    text: 'Book Count',
                },
                tooltip: {
                    enabled: false,
                },
                xaxis: {
                    categories: [],
                },
                yaxis: {
                    labels: { show: false },
                },
            },
            series: [{
                name: 'Books',
                data: [],
            }],
        },
    }; },
	mixins: [pageHelpers],
    mounted: function() {
        this.$emit('breadcrumbsChange', []);

        this.authorLeaderboard.options.xaxis.categories = [['Mark', 'Chavez']]; // Author Names
        this.authorLeaderboard.series[0].data = [3]; // Author Book Count
        this.authorLeaderboard.displayLoading = false;
        this.authorLeaderboard.dispayChart = true;
    },
}
</script>

<style>
</style>