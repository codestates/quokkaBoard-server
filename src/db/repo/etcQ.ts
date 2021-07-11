import { EntityRepository, Repository } from 'typeorm';
import { Tag } from '@entity/Tag';
import { StrNumProps } from '@types';


@EntityRepository(Tag)
export class TagRepo extends Repository <Tag> {
    
    findTag(data: StrNumProps) {
        return this
        .createQueryBuilder("tag")
        .where({id: data.tagId})
        .getOne();
    }

    updateTag(data: StrNumProps) {
        return this
        .createQueryBuilder("tag")
        .update(Tag)
        .set({
            content: data.tagContent as string,
            hex: data.tagColor as string,
        })
        .where({id: data.tagId})
        .execute();
    }
}