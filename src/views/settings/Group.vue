<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle">
            <Col span="24">
                <h1>
                    <img :src="logo">
                </h1>
                <h2>
                    <p>Welcome to Group !</p>
                </h2>
            </Col>
        </Row>
    </div>
</template>

<script>
import logo from '@/assets/images/logo-mini.png'
export default {
    data() {
        return {
            logo: logo
        }
    }
}
</script>

<style scoped>
    .index {
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        text-align: center;
    }

    .index h1 {
        height: 150px;
    }

    .index h1 img {
        height: 100%;
    }

    .index h2 {
        color: #666;
        margin-bottom: 200px;
    }

    .index h2 p {
        margin: 0 0 50px;
    }

    .index .ivu-row-flex {
        height: 100%;
    }
</style>
