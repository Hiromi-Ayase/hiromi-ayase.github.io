var list = [];
for (var i = 0; i < rawData.length; i ++) {
    var d = rawData[i];
    var start = d.started_year + "/" + d.started_month + "/" + d.started_day;
    list[i] = [d.id, d.madb_id, d.medium, start, d.broadcast, d.author, "<a href=\"https://www.youtube.com/results?search_query=" + encodeURIComponent(d.title) + "\">Youtubeで見る</a>", "<a href=\"" + d.madb_uri + "\">link</a>"];
}
$(document)
        .ready(
                function () {/* activate sidebar */
                    $('#sidebar').affix({
                        offset : {
                            top : 135
                        }
                    });

                    /* activate scrollspy menu */
                    var $body = $(document.body);
                    var navHeight = $('.navbar').outerHeight(true) + 10;

                    $body.scrollspy({
                        target : '#leftCol',
                        offset : navHeight
                    });

                    var status = document.getElementById('status');
                    new IncSearch.ViewTable(
                            'text', // 入力が行われるエレメントのID
                            'view_area', // 検索結果を表示するエレメントのID
                            list, // 検索対象のリスト
                            {
                                dispMax : 10, // オプション
                                startElementText : '<table class="table table-bordered"><tr><th>タイトル</th><th>Media Art DB ID</th><th>メディア</th><th>放送開始日</th><th>配信</th><th>作者</th><th>Youtube検索</th><th>メディアDB</th>',
                                searchBefore : function () {
                                    status.innerHTML = 'search...';
                                },
                                searchAfter : function () {
                                    var matchCount = this.matchList.length;
                                    var displayInfo = '';

                                    if (matchCount != 0) {
                                        var start = 1;
                                        var end = this.dispMax;

                                        if (this.dispMax == 0
                                                || end > matchCount) {
                                            end = matchCount;
                                        }
                                        displayInfo = '(<span id="display">'
                                                + start + 'から' + end
                                                + '</span>件まで表示)';
                                    }
                                    status.innerHTML = this.searchValues.length
                                            .toString()
                                            + '件中 '
                                            + matchCount
                                            + '件ヒット '
                                            + displayInfo;
                                },
                                changePageAfter : function (pageNo) {
                                    var matchCount = this.matchList.length;

                                    var start = (pageNo - 1) * this.dispMax + 1;
                                    var end = start + this.dispMax - 1;

                                    if (end > matchCount) {
                                        end = matchCount;
                                    }

                                    var display = document
                                            .getElementById('display');
                                    display.innerHTML = start.toString() + 'から'
                                            + end;
                                },
                                pageLink : 'page_link',
                                pagePrevName : '前ページ',
                                pageNextName : '次ページ',
                                moveRow : true,
                                selectRowCallback : function (rowData) {
                                    setTimeout(function () {
                                        alert(rowData)
                                    }, 1);
                                },
                                useHotkey : true
                            });
                });