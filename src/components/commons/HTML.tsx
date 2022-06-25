
export const HTML = (
    customerName:any,
    customerID:any,
    customerAddress:any,
    customerPhone:any,
    senderName:any,
    senderAddress:any,
    deliveryDate:any,
    deliveryplace:any,
    doNo:any,
    soNo:any,
    vehicleNo:any,
    totalQuantity:any,
    totalWeight:any,
    table:any

) => `<!DOCTYPE html
PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<style type="text/css">
    * {
        margin: 0;
        padding: 0;
        text-indent: 0;
        box-sizing: border-box;
    }

    h3 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 12pt;
    }

    h1 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 17pt;
    }

    h2 {
        color: #00F;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 15pt;
    }

    p {
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 12pt;
        /* margin: 0pt; */
    }

    .s1 {
        color: #00F;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 12pt;
    }

    .s2 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: italic;
        font-weight: normal;
        text-decoration: none;
        font-size: 15pt;
    }

    .s3 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 7pt;
        vertical-align: 1pt;
    }

    .s4 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 12pt;
    }

    .s5 {
        color: #00F;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 12pt;
        padding-top: 5pt;
    }

    .s6 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 1pt;
    }

    table,
    tbody {
        vertical-align: top;
        overflow: visible;
    }
</style>
</head>

<body>


<!-- header -->

<div style="margin-top:15pt;display:flex;position:absolute">
    <span>
        <table border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td>
                    <div style="position:absolute;width:500pt">
                        <img width="140" height="70"
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAAAuCAMAAADk4TwrAAABAlBMVEX///8AAAD0Zxf//v/8//////3t7e07OzucnJyWlpb///z//f/f398qKir6///6+vq6urpjY2MjIyP0XgD1ZhXxaBTyYQD09PT2XgDZ2dn2ZRfKysrq6ur6//xbW1vwWABCQkIZGRkSEhKrq6vAwMBKSkqFhYUfHx/xZADzVQB6enozMzNGRkZ0dHT4yrT95dj6076mpqb2hUr89u/98On2s5T0bCD6r4f2ekD4onj2iVj2bir/6dz4k2b3sov7xKj+7vL1dy/30rXwoH71kmr6wav7vqH1t5Lvczb618f3chv4j1/6q3796NT89Of0ekf0hD/80sHyk17xiEzvdyn4oW9J4H5xAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAOxAAADsQBlSsOGwAABcZJREFUWIWlVwtP4zgQTjI2S1OQAcVUiBYtlAVU2GshobzKoiIdKFp04jj6///Kzdge20m7q5PO3S3x2JmZbx6f3SSJB5iPkECPVsBf7QGRmHe1/vkd/q97gL+negFBagYvh3fDFFa5ANZb/mqOKst0ppXVBFLKXEpgTM4WNDxjB2LHg/PQnkDykdEoBiBUffc5n881jkXVlcvOGnyQRBYaIWrAg8jgozGRvUKZg0wQAIhJVuhpCcLHshFHhwsaTnvQHEz2hP7OCmNCsyP4GQymKJjlwDt9FUQmkkgdb4AIH35L+YxxFyA/baRChhGHKjA/eeQbVx9wNoIh8KZCgNwjyOurvwSI3MC4dZvsf/kTjV75eRKp8hojYZz7ZgFDlU1/KMiv0Oe8uaNGFGcDWJXHpSqIM9GwRn8H3Vus2NdSYKUCfkSCgTOlVBG0WYgFBE0889b9Khec34ujArnQOiuKz/vXuszJTl6+CVwtKXh/LNf+b2Asd3cuyz9RmbzPeBQ4dEFdCMlMo+CpG5MGrHh005Cm2AMJkzckJwzO1FUtGsDvO2G2TshELW39QKwdQgEwyKi2YtNi8W6jLkttMejd3dtnIW0QFyQqW+Th1bRQcFFBDHAg51rw/NrG6Yfw7whxhoKzfEXYV7i7vIc059OiYgYAYWBoLUNpKBK8Y4XZQDEhJMuIPGdwS9kNUk6zx26I2YuNVB68uKH5OOqvWHfUJhGtQsQdaOGzOMtFwqwCtr+zGjidYHCJoCGcEjFfhSS4tPviEsjfL5KLgcS3xsQjq4AxmZjkzJ2NkmrgiSghMAF+JkVWyDio8GxMzD2TPRgQ0I5Nq7hizmjkQioMy90g9kpWxsSUX0X2KHQFTY9jzatHkCN5F0o01pRumEDeKj7ypLFlqalXqXapIWrQ4FNtWN2a+HSBr8mccKDjc98fUA0i5xLxgZLEF1cRzZPMkF72j1EhqU0KJSEEmO0AN4nn3ygFYYkpNKpuZFxj4tnMuvcYpur/XHJeqQfGzXVZ29Yz2/AwKmoP0Zc/xLp+f8kx9Vh5kXXONLOmt2W5q7EHxcrM/sdLDvGbRRG05IajaupGWWR6PJBNzS1f2+dCEmJkRmbOmqaT1CnZA5gnjfyYtFU0IvHLxmCxoaM5xIGEF6qhEkGgrakCmYQa9SdBCxCsSDrv1/5e5hUIOu5ekA0rvGlKrwfar3IaoF0CYck8Wcab5H5pIN5Q8JHn4rXQs+jqFO7ooYDZ+dZtyheAmdaFOxtYJsfUi6JbPugPaW5O/fQ07XNYttOR/zGwnZqxuWXeTd1QTvVR2ndR2TUmpnzxlsR5N2KwwIuyA9zH9/rOP4XPPh4Hafq1t4GSC2fi+/eD86OeXcS3zh2icWZw6EqaHxPXRKrlo85mnryNCRfzDj4PGRGa+JYkeyjqWRNrboVQbhpANn61tpem7EmJp7Pso77RxbyS/rbgUCQ+GkecNjKBUhTtsQlf4D3auc3pKKea72Z0fcr0iwKIshpMwDDddwpdoJwJjLpHYfP0Nd2wMTU787y6xVsfNUOh32slG0egR5GYFALqPQ25QBPrFheZ2Fhb6+/ZlKabcJSml2wSg4IVNKswHQPgH5ChBn26YS9dB0p4zyJEE+eX52hBxRVl3hohoi2aRE3km699SQJgFIB+IcBD8h1cLo4uttctQhMopVSPliQBkyamkf6VI0KBz2uoEgdOpQ9U2BoqKkmG6c7mzg5KDm2DBoZo/zKwLWaLFh+/pKPRyQnV7UmUCw6ErShbJ9QiOEgUqCbyunGq4aDSoN/hKv1i5h0O+C9R7Js8AyCOC+9ppNnxmj/e4Vua7pBgG10ieJTwY1o9sFlxh7hx2b5/mNpXt2z7RQy5dBkG1VlTHSoZMNlznXLq2s+hcHp9X8BGummbHHxMGUFAw22nRtTNQzPZG146Aj3ubF0S2Q2HW8OgoHM8dPTUOdl3Okaj9ZN/AS32YONT0hjrAAAAAElFTkSuQmCC" />
                        <h3 style="padding-top: 5pt;">JAPFA COMFEED VIETNAM CO., LTD</h3>
                    </div>
                </td>

                <td style="text-align: center;">
                    <div
                        style="padding-top: 25pt; margin-left: 130pt; align-self: center;position: absolute;width: 500pt">
                        <h1>DELIVERY ORDER</h1>
                        <h2 style="text-align: center;">PHIẾU XUẤT KHO</h2>
                    </div>
                </td>

                <td>
                    <div style="position: absolute;width:500pt;margin-left: 560pt;">
                        <p style="padding-top: 3pt;text-align: left;">
                            No / <span style=" color: #00F;">Số phiếu </span>: ${doNo}
                        </p>
                        <p style="padding-top: 3pt;text-align: left;">
                            Date / <span style=" color: #00F;">Ngày </span>:${deliveryDate}
                        </p>
                        <p style="padding-top: 3pt;text-align:left;">
                            Order No. /<span style=" color: #00F;">Đơn hàng </span>: ${soNo}
                        </p>
                        <p style="padding-top: 3pt;text-align: left;">
                            Vehicle No./
                            <span style=" color: #00F;">Số xe</span>: ${vehicleNo}
                        </p>
                    </div>
                </td>
            </tr>
        </table>
    </span>
</div>




<!-- body -->

<!-- body header -->
<div style="margin-top:100pt;display:inline-block;position: absolute;">
    <span>
        <table>
            <tr>
                <td>
                    <h3 style="text-indent: 0pt;text-align: left;">Division :</h3>
                    <h3 style="padding-top: 3pt;text-indent: 0pt;text-align: left;">Section :</h3>
                </td>

                <td>
                    <p style="padding-left: 3pt;">Swine Bussiness</p>
                </td>

                <td style="align-items: right;">
                    <p class="s2"
                        style="padding-top: 11pt;margin-left: 420pt;padding-left: 6pt;text-indent: 0pt;text-align: right;">
                        (DO IS NOT FINAL)</p>
                </td>
            </tr>
        </table>
    </span>
</div>




<!-- body info -->
<div style="margin-top:135pt;display:inline-block;">
    <span>
        <table>
            <td>
                <div style="min-width: 50%;position: absolute;width:500pt">
                    <p style="padding-top: 4pt;text-indent: 0pt;text-align: left;">
                        Customer code / <span style=" color: #00F;">Mã khách hàng </span>: ${customerID}
                    </p>
                    <p style="padding-top: 2pt;text-indent: 0pt;text-align: left;">
                        Customer name / <span style=" color: #00F;">Tên khách hàng </span>: ${customerName}
                    </p>
                    <p style="padding-top: 2pt;text-indent: 0pt;text-align: left;">
                        Cust. address / <span style=" color: #00F;">Đ/c khách hàng </span>: ${customerAddress}
                    </p>
                    <p style="padding-top: 2pt;text-indent: 0pt;text-align: left;">
                        Receiver Name / <span style=" color: #00F;">Tên người nhận </span>: ${customerName}
                    </p>
                </div>
            </td>

            <td>
                <div style="min-width: 50%;position: absolute;margin-left: 380pt;">
                    <p style="padding-top: 2pt;text-indent: 0pt;">
                        Sender name/ <span style=" color: #00F;">Tên trại xuất </span>: ${senderName}
                    </p>
                    <p style="padding-top: 2pt;text-indent: 0pt;">
                        Sender address/ <span style=" color: #00F;">Đ/c trại xuất </span>: ${senderAddress}
                    </p>
                    <p style="padding-top: 2pt;text-indent: 0pt;">
                        Delivery Date/ <span style=" color: #00F;">Ngày xuất </span>: ${deliveryDate}
                    </p>
                    <p style="padding-top: 2pt;text-indent: 0pt;">
                        Delivery Place/ <span style=" color: #00F;">Đ/c giao hàng </span>: ${deliveryplace}
                    </p>
                </div>
            </td>
        </table>
    </span>
</div>

<p style="text-indent: 0pt;text-align: left;"><br /></p>




<!-- body content -->
<!-- table -->
<div style="margin-top:65pt">
    <table style="border-collapse:collapse;min-width:100%" cellspacing="0">
        <tr style="height:23pt">
            <td
                style="width:30pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:1pt">
                <p class="s4"
                    style="padding-top: 2pt;padding-left: 7pt;padding-right: 5pt;text-indent: 1pt;text-align: left;">No.
                    <span style=" color: #00F;">STT</span>
                </p>
            </td>
            <td
                style="width:182pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:1pt">
                <p class="s4"
                    style="padding-top: 2pt;padding-left: 61pt;padding-right: 61pt;text-indent: 0pt;line-height: 9pt;text-align: center;">
                    Type of Product</p>
                <p class="s5"
                    style="padding-left: 61pt;padding-right: 61pt;text-indent: 0pt;line-height: 9pt;text-align: center;">
                    Loại Sản Phẩm</p>
            </td>
            <td
                style="width:45pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:1pt">
                <p class="s4"
                    style="padding-top: 2pt;padding-left: 7pt;text-indent: 0pt;line-height: 9pt;text-align: left;">
                    Quantity</p>
                <p class="s5" style="padding-left: 4pt;text-indent: 0pt;line-height: 9pt;text-align: left;">Số Lượng</p>
            </td>
            <td
                style="width:41pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:1pt">
                <p class="s4"
                    style="padding-top: 2pt;padding-left: 11pt;text-indent: 0pt;line-height: 9pt;text-align: left;">UOM
                </p>
                <p class="s5" style="padding-left: 12pt;text-indent: 0pt;line-height: 9pt;text-align: left;">ĐVT</p>
            </td>
            <td
                style="width:69pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:1pt">
                <p class="s4"
                    style="padding-top: 2pt;padding-left: 3pt;text-indent: 0pt;line-height: 9pt;text-align: left;">BW
                    Average (kg)</p>
                <p class="s5" style="padding-left: 4pt;text-indent: 0pt;line-height: 9pt;text-align: left;">Trọng Lượng
                    TB</p>
            </td>
            <td
                style="width:77pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:1pt">
                <p class="s4"
                    style="padding-top: 2pt;padding-left: 3pt;padding-right: 3pt;text-indent: 0pt;line-height: 9pt;text-align: center;">
                    Total Weight</p>
                <p class="s5"
                    style="padding-left: 3pt;padding-right: 3pt;text-indent: 0pt;line-height: 9pt;text-align: center;">
                    Tổng Trọng Lượng</p>
            </td>
            <td
                style="width:128pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:1pt">
                <p class="s4"
                    style="padding-top: 2pt;padding-left: 47pt;padding-right: 46pt;text-indent: 0pt;line-height: 9pt;text-align: center;">
                    Remarks</p>
                <p class="s5"
                    style="padding-left: 46pt;padding-right: 46pt;text-indent: 0pt;line-height: 9pt;text-align: center;">
                    Ghi Chú</p>
            </td>
        </tr>
        ${table}
        <tr style="height:19pt">
            <td style="width:212pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:1pt"
                colspan="2">
                <p class="s4" style="padding-top: 4pt;padding-left: 47pt;text-indent: 0pt;text-align: left;">TOTAL /
                    <span style=" color: #00F;">TỔNG :</span>
                </p>
            </td>
            <td
                style="width:45pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:1pt">
                <p class="s4" style="padding-top: 4pt;text-indent: 0pt;text-align: right;">${totalQuantity}</p>
            </td>
            <td
                style="width:41pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:1pt">
                <p style="text-indent: 0pt;text-align: left;"><br /></p>
            </td>
            <td
                style="width:69pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:1pt">
                <p style="text-indent: 0pt;text-align: left;"><br /></p>
            </td>
            <td
                style="width:77pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:1pt">
                <p class="s4" style="padding-top: 4pt;text-indent: 0pt;text-align: right;">${totalWeight}</p>
            </td>
            <td
                style="width:128pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:1pt">
                <p style="text-indent: 0pt;text-align: left;"><br /></p>
            </td>
        </tr>
    </table>
</div>

<p style="text-indent: 0pt;text-align: left;"><br /></p>



<!-- footer -->
<div style="margin-top:5pt; overflow:hidden">
    <div style="margin-left: 50pt;">
        <span>
            <table>
                <tr>
                    <td>
                        <p style="padding-bottom: 5pt;line-height: 9pt;text-align: center;">
                            Prepared by,
                        </p>
                        <p class="s1" style="line-height: 9pt;text-align: center;padding-top: 5pt;">
                            Người lập,
                        </p>
                    </td>

                    <td>
                        <p style="padding-bottom: 5pt;margin-left: 450pt;line-height: 9pt;text-align: center;">
                            Verified by,</p>
                        <p class="s1"
                            style="margin-left: 450pt;line-height: 9pt;text-align: center;padding-bottom: 50pt;">
                            Người kiểm tra,</p>
                    </td>
                </tr>

                <tr>
                    <td>
                        <p style="line-height: 9pt;text-align: center;padding-top: 5pt;">
                            Sale Admin
                        </p>
                        <p class="s1" style="line-height: 9pt;text-align: center;padding-top: 5pt;">
                            Admin bán hàng
                        </p>
                    </td>
                    <td>
                        <p style="padding-bottom: 5pt;margin-left: 450pt;line-height: 9pt;text-align: center;">
                            Sales Supervisor
                        </p>
                        <p class="s1" style="margin-left:450pt;line-height: 9pt;text-align: center;">
                            Spv bán bàng
                        </p>
                    </td>
                </tr>
            </table>
    </div>

    <table>
        <tr>
            <td>
                <p style="text-indent: 0pt;text-align: center; padding-top: 10pt;">
                    1. (White) Sales Admin HO/ <span style=" color: #00F;">(Trắng) Admin bán hàng HO </span>
                </p>
            </td>

            <td>
                <p
                    style="text-indent: 0pt;text-align: center;padding-top: 10pt;padding-bottom: 30pt;padding-left: 50pt;">
                    2.(Red) Accounting <span style=" color: #00F;">/ (Đỏ) Kế Toán</span>
                </p>
            </td>
        </tr>
    </table>
    </span>
</div>
</body>
</html>`
