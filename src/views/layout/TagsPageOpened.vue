<template>
    <div ref="scrollCon" @mousewheel="handleScroll" class="tags-outer-scroll-con">
        <div class="close-all-tag-con">
            <Dropdown transfer @on-click="handleTagsOption">
                <Button size="small" type="primary">
                    标签选项
                    <Icon type="arrow-down-b"></Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem name="clearAll">关闭所有</DropdownItem>
                    <DropdownItem name="clearOthers">关闭其他</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <div ref="scrollBody" class="tags-inner-scroll-body" :style="{ left: tagBodyLeft + 'px' }">
            <transition-group name="taglist-moving-animation">
                <Tag type="dot" v-for="(item, index) in pageTagsList" ref="tagsPageOpened" :key="index" :name="item.name" @on-close="closePage" @click.native="linkTo(item)" :closable="!keep.includes(item.name)" :color="item.name === $route.name ? 'blue' : 'default'">{{ item.title }}</Tag>
            </transition-group>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { REMOVE_TAGS, CLEAR_TAGS } from '@/store/modules/layout'

export default {
    data() {
        return {
            tagBodyLeft: 0,
            keep: ['home']
        }
    },
    props: {
        pageTagsList: {
            type: Array,
            default: () => []
        }
    },
    computed: mapState({
        tags: state => state.layout.tags
    }),
    methods: {
        ...mapActions([REMOVE_TAGS, CLEAR_TAGS]),
        closePage(event, name) {
            this.REMOVE_TAGS(name)
            if (this.$route.name === name) {
                this.$router.push({
                    name: this.tags[this.tags.length - 1].name
                })
            }
        },
        linkTo(item) {
            this.$router.push({
                name: item.name,
                query: item.query,
                params: item.params
            })
        },
        handleScroll(e) {
            let left = 0
            if (e.wheelDelta > 0) {
                left = Math.min(0, this.tagBodyLeft + e.wheelDelta)
            } else {
                if (
                    this.$refs.scrollCon.offsetWidth - 100 <
                    this.$refs.scrollBody.offsetWidth
                ) {
                    if (
                        this.tagBodyLeft <
                        -(
                            this.$refs.scrollBody.offsetWidth -
                            this.$refs.scrollCon.offsetWidth +
                            100
                        )
                    ) {
                        left = this.tagBodyLeft
                    } else {
                        left = Math.max(
                            this.tagBodyLeft + e.wheelDelta,
                            this.$refs.scrollCon.offsetWidth -
                                this.$refs.scrollBody.offsetWidth -
                                100
                        )
                    }
                } else {
                    this.tagBodyLeft = 0
                }
            }
            this.tagBodyLeft = left
        },
        handleTagsOption(type) {
            if (type === 'clearAll') {
                this.CLEAR_TAGS()
                this.$router.push({
                    name: 'home'
                })
            } else {
                this.CLEAR_TAGS(this.$route.name)
            }

            this.tagBodyLeft = 0
        },
        moveToView(tag) {
            if (tag.offsetLeft < -this.tagBodyLeft) {
                // 标签在可视区域左侧
                this.tagBodyLeft = -tag.offsetLeft + 10
            } else if (
                tag.offsetLeft + 10 > -this.tagBodyLeft &&
                tag.offsetLeft + tag.offsetWidth <
                    -this.tagBodyLeft + this.$refs.scrollCon.offsetWidth - 100
            ) {
                // 标签在可视区域
            } else {
                // 标签在可视区域右侧
                this.tagBodyLeft = -(
                    tag.offsetLeft -
                    (this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth) +
                    20
                )
            }
        },
        currentTag() {
            const tag = this.$refs.tagsPageOpened.find(item => {
                return this.$route.name === item.name
            })
            if (tag) this.moveToView(tag.$el)
        }
    },
    // mounted() {
    //     setTimeout(() => {
    //         this.currentTag()
    //     }, 0)
    // },
    watch: {
        $route(to) {
            this.$nextTick(() => {
                this.currentTag()
            })
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-outer-scroll-con {
    position: relative;
    box-sizing: border-box;
    padding-right: 120px;
    width: 100%;
    height: 100%;
    .tags-inner-scroll-body {
        position: absolute;
        padding: 2px 10px;
        overflow: visible;
        white-space: nowrap;
        transition: left 0.3s ease;
    }
    .close-all-tag-con {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 8px;
        text-align: center;
        width: 110px;
        height: 100%;
        background: white;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
        z-index: 10;
    }
}

.taglist-moving-animation-move {
    transition: transform 0.3s;
}
</style>
