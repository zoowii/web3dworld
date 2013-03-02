define(function (require, exports, module) {
    $(function () {
        var $editViewArea, canvas_height, container, control_area, edit_area, edit_view_area, menuBar, panel_height, view_area;
        menuBar = $(".menu-bar");
        container = $(".container");
        control_area = $(".control-area");
        edit_view_area = $(".edit-view-area");
        edit_area = $('.edit-area');
        view_area = $(".view-area");
        container.css({
            top: (menuBar.height() + 1) + 'px'
        });
        panel_height = window.innerHeight - menuBar.height() - 1;
        canvas_height = panel_height - 80;
        $editViewArea = $(".edit-view-area");
        $(".show_2d_btn").click(function () {
            $(".view_area").hide();
            return $(".edit_area").show();
        });
        $(".show_3d_btn").click(function () {
            $(".edit_area").hide();
            return $(".view_area").show();
        });
    });

});
