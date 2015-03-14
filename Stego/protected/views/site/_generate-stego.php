<div class="modal fade" id="generate_stego" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">

            <!-- Create Modifier Form -->
            <form id="generate_stego_form" method="post">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title">Generate Stego</h4>
                </div>
                <div class="modal-body">
                    <canvas id="myCanvas" width="578" height="200" style="display:none;"></canvas>
                    <img id="canvasImg" alt="Right click to save me!">
                    <div class="form-group">
                        <label for="Sale_description" id="Sale_description_label" class="control-label">Stego content</label>
                        <textarea name="Sale[sale_description]" type="text" id="Sale_description_create" class="form-control" required></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="btn-group btn-group-justified">
                        <div class="btn-group">
                            <button class="btn btn-default" type="button" data-dismiss="modal">Cancel</button>
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-primary" id="generate_stego_submit_button" data-loading-text="Loading..." autocomplete="off" type="button">Generate</button>
                        </div>
                    </div>
                </div>
            </form>

        </div>
    </div>
</div>

<script type="text/javascript">
    $('#generate_stego_submit_button').click(function() {
        var colorMap = createImage($('#Sale_description_create').val());
        document.getElementById('myCanvas').width = colorMap.length;
        document.getElementById('myCanvas').height = colorMap.length;
        
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');
        for (var i = 0; i < colorMap.length; i ++)
        {
            for (var j = 0; j < colorMap.length; j ++)
            {
                context.fillStyle = "rgba("+colorMap[i][j][0]+","+colorMap[i][j][1]+","+colorMap[i][j][2]+","+255+")";
                context.fillRect( i, j, 1, 1 );
            }
        }
        var dataURL = canvas.toDataURL();
        document.getElementById('canvasImg').src = dataURL;
    });
</script>