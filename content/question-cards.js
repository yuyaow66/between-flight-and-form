const questionStages = [
  {
    id: 'childhood',
    label: 'Childhood',
    zh: '童年',
    questions: [
      {
        zh: '你今天乖不乖？',
        en: 'Have you been a good girl today?',
        images: {
          en: 'assets/childhood-strips/IMG_3783.png',
          zh: 'assets/childhood-strips/IMG_3784.png',
        },
      },
      {
        zh: '这次考试在班里排第几？',
        en: 'Where did you rank in your class this time?',
        images: {
          en: 'assets/childhood-strips/IMG_3779.png',
          zh: 'assets/childhood-strips/IMG_3780.png',
        },
      },
      {
        zh: '别人都会了，你怎么还不会？',
        en: 'Everyone else can do it. Why can’t you?',
        images: {
          en: 'assets/childhood-strips/IMG_3795.png',
          zh: 'assets/childhood-strips/IMG_3796.png',
        },
      },
      {
        zh: '女孩子是不是应该安静一点？',
        en: 'Shouldn’t a girl be a little quieter?',
        images: {
          en: 'assets/childhood-strips/IMG_3793.png',
          zh: 'assets/childhood-strips/IMG_3794.png',
        },
      },
      {
        zh: '你怎么又把裙子弄脏了？',
        en: 'How did you get your dress dirty again?',
        images: {
          en: 'assets/childhood-strips/IMG_3789.png',
          zh: 'assets/childhood-strips/IMG_3790.png',
        },
      },
      {
        zh: '你是姐姐，让着弟弟不行吗？',
        en: 'You’re his older sister. Can’t you let him have his way?',
        images: {
          en: 'assets/childhood-strips/IMG_3785.png',
          zh: 'assets/childhood-strips/IMG_3786.png',
        },
      },
      {
        zh: '见到长辈，怎么不知道叫人？',
        en: 'Why haven’t you greeted your elders?',
        images: {
          en: 'assets/childhood-strips/IMG_3769.png',
          zh: 'assets/childhood-strips/IMG_3770.png',
        },
      },
      {
        zh: '让亲戚抱一下，怎么还不愿意？',
        en: 'Why won’t you let your relative give you a hug?',
        images: {
          en: 'assets/childhood-strips/IMG_3791.png',
          zh: 'assets/childhood-strips/IMG_3792.png',
        },
      },
      {
        zh: '你怎么总玩男孩子的玩具？',
        en: 'Why do you always play with boys’ toys?',
        images: {
          en: 'assets/childhood-strips/IMG_3781.png',
          zh: 'assets/childhood-strips/IMG_3782.png',
        },
      },
      {
        zh: '学钢琴不好吗，为什么非要踢球？',
        en: 'What’s wrong with learning piano? Why do you insist on football?',
        images: {
          en: 'assets/childhood-strips/IMG_3767.png',
          zh: 'assets/childhood-strips/IMG_3768.png',
        },
      },
      {
        zh: '作业写完了吗，就想着玩？',
        en: 'Have you finished your homework, or are you already thinking about playing?',
        images: {
          en: 'assets/childhood-strips/IMG_3787.png',
          zh: 'assets/childhood-strips/IMG_3788.png',
        },
      },
      {
        zh: '你看别人家的孩子，怎么那么省心？',
        en: 'Why can’t you be as easy to raise as other people’s children?',
        images: {
          en: 'assets/childhood-strips/IMG_3777.png',
          zh: 'assets/childhood-strips/IMG_3778.png',
        },
      },
      {
        zh: '女孩子不是应该更细心吗？',
        en: 'Aren’t girls supposed to be more careful?',
        images: {
          en: 'assets/childhood-strips/IMG_3799.png',
          zh: 'assets/childhood-strips/IMG_3800.png',
        },
      },
      {
        zh: '妈妈这么辛苦，你怎么还不懂事？',
        en: 'Your mum works so hard. Why can’t you be more considerate?',
        images: {
          en: 'assets/childhood-strips/IMG_3803.png',
          zh: 'assets/childhood-strips/IMG_3804.png',
        },
      },
      {
        zh: '为什么不帮妈妈做家务？',
        en: 'Why aren’t you helping your mum with the housework?',
        images: {
          en: 'assets/childhood-strips/IMG_3801.png',
          zh: 'assets/childhood-strips/IMG_3802.png',
        },
      },
      {
        zh: '你怎么又哭了，这有什么好哭的？',
        en: 'Why are you crying again? What is there to cry about?',
        images: {
          en: 'assets/childhood-strips/IMG_3797.png',
          zh: 'assets/childhood-strips/IMG_3798.png',
        },
      },
      {
        zh: '老师说你爱说话，你就不能忍一忍吗？',
        en: 'Your teacher says you talk too much. Can’t you hold it in?',
        images: {
          en: 'assets/childhood-strips/IMG_3772.png',
          zh: 'assets/childhood-strips/IMG_3771.png',
        },
      },
      {
        zh: '你长大以后，要怎么报答爸爸妈妈？',
        en: 'How will you repay your parents when you grow up?',
        images: {
          en: 'assets/childhood-strips/IMG_3775.png',
          zh: 'assets/childhood-strips/IMG_3776.png',
        },
      },
      {
        zh: '这么多兴趣班，哪一个是你最拿得出手的？',
        en: 'With all those classes, what are you good enough at to show people?',
        images: {
          en: 'assets/childhood-strips/IMG_3765.png',
          zh: 'assets/childhood-strips/IMG_3766.png',
        },
      },
      {
        zh: '我们都是为你好，你为什么不听？',
        en: 'We only want what’s best for you. Why won’t you listen?',
        images: {
          en: 'assets/childhood-strips/IMG_3773.png',
          zh: 'assets/childhood-strips/IMG_3774.png',
        },
      },
    ],
  },
  {
    id: 'adolescence',
    label: 'Adolescence',
    zh: '青春期',
    questions: [
      {
        zh: '女孩子到了高中，理科还能跟得上吗？',
        en: 'Can girls still keep up in science once they reach high school?',
        images: {
          en: 'assets/adolescence-strips/IMG_3878.webp',
          zh: 'assets/adolescence-strips/IMG_3879.webp',
        },
      },
      {
        zh: '成绩这么好，怎么偏偏要学艺术？',
        en: 'With grades like yours, why would you choose art?',
        images: {
          en: 'assets/adolescence-strips/IMG_3872.webp',
          zh: 'assets/adolescence-strips/IMG_3873.webp',
        },
      },
      {
        zh: '你现在不拼，以后怎么考上好大学？',
        en: 'If you don’t push yourself now, how will you get into a good university?',
        images: {
          en: 'assets/adolescence-strips/IMG_3892.webp',
          zh: 'assets/adolescence-strips/IMG_3893.webp',
        },
      },
      {
        zh: '都这个年纪了，怎么还不知道打扮？',
        en: 'At your age, shouldn’t you start making more effort with how you look?',
        images: {
          en: 'assets/adolescence-strips/IMG_3890.webp',
          zh: 'assets/adolescence-strips/IMG_3891.webp',
        },
      },
      {
        zh: '你是来上学的，还是来打扮的？',
        en: 'Are you here to study or to show off?',
        images: {
          en: 'assets/adolescence-strips/IMG_3888.webp',
          zh: 'assets/adolescence-strips/IMG_3889.webp',
        },
      },
      {
        zh: '你是不是又胖了？',
        en: 'Have you put on weight again?',
        images: {
          en: 'assets/adolescence-strips/IMG_3886.webp',
          zh: 'assets/adolescence-strips/IMG_3887.webp',
        },
      },
      {
        zh: '女孩子吃这么多干什么？',
        en: 'Why does a girl need to eat so much?',
        images: {
          en: 'assets/adolescence-strips/IMG_3884.webp',
          zh: 'assets/adolescence-strips/IMG_3885.webp',
        },
      },
      {
        zh: '穿这么短，你不怕别人议论吗？',
        en: 'Aren’t you worried about what people will say if you wear something that short?',
        images: {
          en: 'assets/adolescence-strips/IMG_3876.webp',
          zh: 'assets/adolescence-strips/IMG_3877.webp',
        },
      },
      {
        zh: '女孩子坐着能不能规矩一点？',
        en: 'Can’t you sit properly, like a young lady?',
        images: {
          en: 'assets/adolescence-strips/IMG_3874.webp',
          zh: 'assets/adolescence-strips/IMG_3875.webp',
        },
      },
      {
        zh: '你怎么晒得这么黑？',
        en: 'Why have you let yourself get so tanned?',
        images: {
          en: 'assets/adolescence-strips/IMG_3880.webp',
          zh: 'assets/adolescence-strips/IMG_3881.webp',
        },
      },
      {
        zh: '你跟那个男生到底是什么关系？',
        en: 'What exactly is going on between you and that boy?',
        images: {
          en: 'assets/adolescence-strips/IMG_3870.webp',
          zh: 'assets/adolescence-strips/IMG_3871.webp',
        },
      },
      {
        zh: '你怎么能喜欢女孩子？',
        en: 'How can you like girls?',
        images: {
          en: 'assets/adolescence-strips/IMG_3868.webp',
          zh: 'assets/adolescence-strips/IMG_3869.webp',
        },
      },
      {
        zh: '手机有什么不能让爸妈看的？',
        en: 'What’s on your phone that you can’t show your parents?',
        images: {
          en: 'assets/adolescence-strips/IMG_3882.webp',
          zh: 'assets/adolescence-strips/IMG_3883.webp',
        },
      },
      {
        zh: '晚上出去，女孩子怎么能这么晚回家？',
        en: 'How can a girl stay out this late?',
        images: {
          en: 'assets/adolescence-strips/IMG_3866.webp',
          zh: 'assets/adolescence-strips/IMG_3867.webp',
        },
      },
      {
        zh: '他为什么只招惹你，不招惹别人？',
        en: 'Why does he pick on you and not anyone else?',
        images: {
          en: 'assets/adolescence-strips/IMG_3864.webp',
          zh: 'assets/adolescence-strips/IMG_3865.webp',
        },
      },
      {
        zh: '有什么委屈不能忍一忍，非要闹大？',
        en: 'Can’t you put up with it instead of making a scene?',
        images: {
          en: 'assets/adolescence-strips/IMG_3862.webp',
          zh: 'assets/adolescence-strips/IMG_3863.webp',
        },
      },
      {
        zh: '女孩子读师范不是更稳妥吗？',
        en: 'Wouldn’t it be safer for a girl to become a teacher?',
        images: {
          en: 'assets/adolescence-strips/IMG_3860.webp',
          zh: 'assets/adolescence-strips/IMG_3861.webp',
        },
      },
      {
        zh: '上大学非要去那么远吗？',
        en: 'Do you really have to go so far away for university?',
        images: {
          en: 'assets/adolescence-strips/IMG_3858.webp',
          zh: 'assets/adolescence-strips/IMG_3859.webp',
        },
      },
      {
        zh: '你这么要强，以后谁受得了你？',
        en: 'If you’re this strong-willed, who will put up with you?',
        images: {
          en: 'assets/adolescence-strips/IMG_3856.webp',
          zh: 'assets/adolescence-strips/IMG_3857.webp',
        },
      },
      {
        zh: '你现在的任务就是学习，想那么多干什么？',
        en: 'Your only job right now is to study. Why are you thinking about anything else?',
        images: {
          en: 'assets/adolescence-strips/IMG_3854.webp',
          zh: 'assets/adolescence-strips/IMG_3855.webp',
        },
      },
    ],
  },
  {
    id: 'womanhood',
    label: 'Womanhood',
    zh: '成年期',
    questions: [
      {
        zh: '工作再好，不结婚有什么用？',
        en: 'What’s the point of a great career if you don’t get married?',
        images: {
          en: 'assets/womanhood-strips/IMG_3933.webp',
          zh: 'assets/womanhood-strips/IMG_3934.webp',
        },
      },
      {
        zh: '你是不是眼光太高了？',
        en: 'Are your standards too high?',
        images: {
          en: 'assets/womanhood-strips/IMG_3931.webp',
          zh: 'assets/womanhood-strips/IMG_3932.webp',
        },
      },
      {
        zh: '你读这么多书，会不会更难找对象？',
        en: 'Won’t it be harder to find a partner if you study so much?',
        images: {
          en: 'assets/womanhood-strips/IMG_3929.webp',
          zh: 'assets/womanhood-strips/IMG_3930.webp',
        },
      },
      {
        zh: '一定要买自己的房子吗，以后不是要嫁人？',
        en: 'Why buy your own home if you’re going to get married anyway?',
        images: {
          en: 'assets/womanhood-strips/IMG_3928.webp',
          zh: 'assets/womanhood-strips/IMG_3927.webp',
        },
      },
      {
        zh: '为什么不找一份离家近的稳定工作？',
        en: 'Why not find a stable job closer to home?',
        images: {
          en: 'assets/womanhood-strips/IMG_3924.webp',
          zh: 'assets/womanhood-strips/IMG_3925.webp',
        },
      },
      {
        zh: '面试时问你婚育计划，不是很正常吗？',
        en: 'What’s wrong with an interviewer asking when you’ll get married or have children?',
        images: {
          en: 'assets/womanhood-strips/IMG_3922.webp',
          zh: 'assets/womanhood-strips/IMG_3923.webp',
        },
      },
      {
        zh: '你这么忙，怎么照顾家庭？',
        en: 'If you’re this busy, how will you take care of a family?',
        images: {
          en: 'assets/womanhood-strips/IMG_3920.webp',
          zh: 'assets/womanhood-strips/IMG_3921.webp',
        },
      },
      {
        zh: '你挣得比他多，不怕他没面子吗？',
        en: 'Won’t he feel embarrassed if you earn more than he does?',
        images: {
          en: 'assets/womanhood-strips/IMG_3918.webp',
          zh: 'assets/womanhood-strips/IMG_3919.webp',
        },
      },
      {
        zh: '结了婚还分什么你的、他的？',
        en: 'Now that you’re married, why keep talking about what’s yours and what’s his?',
        images: {
          en: 'assets/womanhood-strips/IMG_3916.webp',
          zh: 'assets/womanhood-strips/IMG_3917.webp',
        },
      },
      {
        zh: '过年为什么不能一直在男方家过？',
        en: 'Why can’t you spend every Lunar New Year with your husband’s family?',
        images: {
          en: 'assets/womanhood-strips/IMG_3914.webp',
          zh: 'assets/womanhood-strips/IMG_3915.webp',
        },
      },
      {
        zh: '不生孩子，你以后不会后悔吗？',
        en: 'Won’t you regret it later if you don’t have children?',
        images: {
          en: 'assets/womanhood-strips/IMG_3912.webp',
          zh: 'assets/womanhood-strips/IMG_3913.webp',
        },
      },
      {
        zh: '都生了一个了，为什么不再生一个？',
        en: 'You’ve already had one. Why not have another?',
        images: {
          en: 'assets/womanhood-strips/IMG_3910.webp',
          zh: 'assets/womanhood-strips/IMG_3911.webp',
        },
      },
      {
        zh: '生了女儿，还不打算要个儿子吗？',
        en: 'You’ve had a daughter. Aren’t you going to try for a son?',
        images: {
          en: 'assets/womanhood-strips/IMG_3908.webp',
          zh: 'assets/womanhood-strips/IMG_3909.webp',
        },
      },
      {
        zh: '孩子这么小，你怎么放心去上班？',
        en: 'How can you go back to work when your child is still so little?',
        images: {
          en: 'assets/womanhood-strips/IMG_3902.webp',
          zh: 'assets/womanhood-strips/IMG_3903.webp',
        },
      },
      {
        zh: '你怎么又为了孩子请假？',
        en: 'Why are you taking time off for your child again?',
        images: {
          en: 'assets/womanhood-strips/IMG_3900.webp',
          zh: 'assets/womanhood-strips/IMG_3901.webp',
        },
      },
      {
        zh: '他都帮你带孩子了，你还有什么不满意？',
        en: 'He even helps you look after the children. What more do you want?',
        images: {
          en: 'assets/womanhood-strips/IMG_3898.webp',
          zh: 'assets/womanhood-strips/IMG_3899.webp',
        },
      },
      {
        zh: '家里这么乱，你平时都在忙什么？',
        en: 'What do you do all day if the house is this messy?',
        images: {
          en: 'assets/womanhood-strips/IMG_3896.webp',
          zh: 'assets/womanhood-strips/IMG_3897.webp',
        },
      },
      {
        zh: '父母年纪大了，你怎么还只顾自己的生活？',
        en: 'Your parents are getting older. How can you still put your own life first?',
        images: {
          en: 'assets/womanhood-strips/IMG_3906.webp',
          zh: 'assets/womanhood-strips/IMG_3907.webp',
        },
      },
      {
        zh: '为了孩子，就不能再忍一忍吗？',
        en: 'Can’t you put up with it a little longer, for the children?',
        images: {
          en: 'assets/womanhood-strips/IMG_3904.webp',
          zh: 'assets/womanhood-strips/IMG_3905.webp',
        },
      },
      {
        zh: '这个年纪重新开始，会不会太晚了？',
        en: 'Isn’t it too late to start over at your age?',
        images: {
          en: 'assets/womanhood-strips/IMG_3894.webp',
          zh: 'assets/womanhood-strips/IMG_3895.webp',
        },
      },
    ],
  },
  {
    id: 'later-life',
    label: 'Later life',
    zh: '晚年',
    questions: [],
  },
];
